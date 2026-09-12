# PeerPulse — A→Z Build Plan

**Status of the repo today:** the frontend redesign is finished (every page and shared component now runs on the new design system — paper/ink/pulse tokens, Plus Jakarta Sans display, Flow-Club-inspired but differentiated layout). There is **no backend at all**: zero API routes, no database, no auth beyond a `localStorage` stub in `components/auth-provider.tsx`, and no `getUserMedia` anywhere in the codebase.

This document is the plan to turn that into the real product:

1. people who work/study get **matched with a peer** studying the same subject,
2. they sit in a **live camera + mic room** with full on/off control,
3. **communities** where people post asking for help and share resources,
4. an **AI agent** that helps when you're stuck.

---

## 0. The stack I recommend (and why)

| Layer | Choice | Why this and not the alternative |
|---|---|---|
| App framework | **Next.js 15 App Router** (already in repo) | One codebase, route handlers double as the API, no second deploy pipeline. |
| Database | **Supabase Postgres** | The matching queries are relational (subject overlap, availability windows, partner history). Firestore/Dynamo make those painful and expensive. Postgres gives us real SQL + joins + `SKIP LOCKED` for race-safe matching. |
| Auth | **Supabase Auth** (email+password, Google, later university email) | Drop-in, JWTs that Postgres can read directly for Row Level Security, no hand-rolled sessions. |
| ORM / migrations | **Drizzle ORM** + `drizzle-kit` migrations | SQL-first, tiny, runs fine on serverless/edge, migration files are plain SQL you can review. (Prisma is fine too if you prefer the DX — it's heavier on cold starts.) |
| Realtime (presence, matchmaking lobby, community feed) | **Supabase Realtime** (Presence + Broadcast) | Already authenticated against the same JWT; we don't run a socket cluster in v1. |
| Object storage (shared resources, PDFs, avatars) | **Supabase Storage** with signed URLs | Private-by-default buckets; `react-pdf` is already vendored in the frontend. |
| Media (camera/mic) | **DEFERRED — decided later.** The UI is written against a `MediaProvider` interface so swapping is a one-file change. Options in §5. | You asked to talk about this later. Nothing is installed; nothing is committed. |
| AI agent | **Vercel AI SDK** + a hosted model (OpenAI or Anthropic) | Streaming, tool-calling, and per-user rate limiting in ~100 lines. Model-agnostic, so we can switch providers without touching the UI. |
| Background jobs | **Vercel Cron → route handler**, backed by `pg_cron` later | Session reminders, batch matching waves, streak updates. |
| Email | **Resend** + React Email templates | Session reminders, weekly digest, magic links. |
| Observability | **Sentry** (errors) + **PostHog** (product analytics) | Matching funnel is the metric that matters; instrument it from day one. |

**Cost at launch:** Supabase free tier + Vercel free/hobby covers the first few hundred users. The first real bill is media egress (§5) — which is exactly why that decision is deferred.

---

## 1. Data model

Created in this order (each migration depends only on the ones above it):

```
universities          id, name, country, domain, city
subjects              id, name, slug, parent_id (e.g. "Math" → "Linear Algebra")

profiles              id → auth.users.id (PK)
                      display_name, avatar_url, bio
                      university_id, major, academic_year
                      timezone (IANA), languages[]
                      weekly_availability jsonb   -- [{dow, start_min, end_min}]
                      is_verified_university bool
                      streak_days, total_focus_minutes, rating_avg, rating_count
                      created_at, last_seen_at

profile_subjects      profile_id, subject_id, level (1-5), want_help bool, can_help bool
                      PK (profile_id, subject_id)

sessions              id, host_id, subject_id, title, goal
                      mode: 'instant' | 'scheduled' | 'group'
                      status: 'open' | 'live' | 'ended' | 'cancelled'
                      scheduled_for, duration_min, max_participants (2 | 4 | 8)
                      room_name (unique), created_at, started_at, ended_at

session_participants  session_id, profile_id, joined_at, left_at
                      camera_on bool, mic_on bool, focus_minutes
                      PK (session_id, profile_id)

match_queue           id, profile_id, subject_id, mode, desired_duration_min
                      status: 'waiting' | 'matched' | 'expired' | 'cancelled'
                      created_at, matched_at, session_id
                      -- one active row per profile: partial unique index on (profile_id)
                      --   where status = 'waiting'

partner_history       profile_id, partner_id, session_id, created_at
                      -- powers the anti-repeat penalty in matching

communities           id, slug, name, description, subject_id, university_id
                      cover_url, is_private, member_count, created_by
community_members     community_id, profile_id, role ('member'|'mod'), joined_at
posts                 id, community_id, author_id, kind: 'question'|'resource'|'note'
                      title, body, solved bool, upvotes, created_at
post_attachments      id, post_id, storage_path, mime, size_bytes, page_count
comments              id, post_id, author_id, body, is_accepted_answer, created_at
votes                 profile_id, post_id, value (1|-1)   PK (profile_id, post_id)

ai_conversations      id, profile_id, title, created_at
ai_messages           id, conversation_id, role, content, tool_calls jsonb, created_at
```

**Row Level Security is mandatory from migration #1.** Baseline policies: profiles are readable by all signed-in users, writable only by their owner; a session's participants can read each other's presence but not each other's `weekly_availability`; community posts are readable by members (or public for public communities).

---

## 2. What gets built first: real auth

Before pairing can exist, `components/auth-provider.tsx` stops being a `localStorage` stub.

1. `npm i @supabase/supabase-js @supabase/ssr drizzle-orm postgres` and `npm i -D drizzle-kit`.
2. `lib/supabase/{client,server,middleware}.ts` — the `@supabase/ssr` trio: browser client, server client bound to cookies, and middleware that refreshes the session on every request.
3. Rewrite `AuthProvider` to hydrate from `supabase.auth.getSession()` and subscribe to `onAuthStateChange`.
4. `app/auth/callback/route.ts` handles the OAuth + magic-link code exchange.
5. Extend the existing onboarding flow (`/setup/study-info`, `/setup/academic-info`) to write `profiles` + `profile_subjects` — **this is the data that makes matching possible**, so treat onboarding as a required, non-skippable step.
6. `middleware.ts` at the repo root protects `/dashboard`, `/study`, `/profile`, `/schedule`, `/messages`, `/settings`, `/community`.

**Gate:** a user can sign up, land in onboarding, pick a university + subjects, and land on `/dashboard` with real persisted data.

---

## 3. Online pairing — step by step

This is the core of the product. Three moving parts: **who is available**, **who to pair them with**, and **not double-booking anyone**.

### Step 3.1 — Presence: know who is actually here

A match is worthless if the other person closed the tab.

- On `/study` mount, join a Supabase Realtime channel `presence:subject:{subjectId}` and `track({ profileId, status: 'idle' })`.
- Heartbeat every 15s; `last_seen_at` updated server-side on each heartbeat.
- Presence payload stays tiny: `{ profileId, subjects: number[], status }`. Never send profiles over presence — clients look those up by ID.
- Anyone whose `last_seen_at` is older than 45s is dropped from the candidate pool.

### Step 3.2 — The queue

- "Start a session" inserts one row into `match_queue` with a partial unique index so a user can only ever be waiting once.
- The client subscribes to its own queue row (`realtime:match_queue:profile_id=eq.{id}`) — when `status` flips to `matched`, it reads `session_id` and routes to `/study/{session_id}`. **The client never decides the match**; that would be trivially cheat-able and would race against other clients.
- A visible wait timer starts. Every 10s the client relaxes nothing — it just shows honest progress ("12 people online in Linear Algebra").

### Step 3.3 — The scoring function

Pure TypeScript, in `lib/matching/score.ts`, so it is unit-testable and can run in both the instant matcher and the batch job:

```ts
export function scorePair(a: Candidate, b: Candidate, now: Date) {
  let s = 0
  s += 0.40 * subjectOverlap(a.subjectIds, b.subjectIds)      // Jaccard index
  s += 0.15 * overlapOfWeeklyAvailability(a, b)                // 0..1
  s += 0.12 * timezoneCompatibility(a.tz, b.tz, now)           // 1 if |Δ| ≤ 2h
  s += 0.10 * complementarity(a, b)                            // one can_help what other want_help
  s += 0.08 * (a.universityId === b.universityId ? 1 : 0)
  s += 0.08 * academicYearProximity(a.year, b.year)
  s += 0.07 * languageOverlap(a.languages, b.languages)
  s -= 0.25 * recencyPenalty(a, b)   // paired in the last 24h? 7d? scale down
  s -= 0.15 * reportedOrBlocked(a, b)
  return s
}
```

Two extras that matter more than the weights:

- **Wait-time decay.** Required score threshold starts at `0.62` and drops linearly to `0.30` over 90 seconds. Nobody waits forever, and early matches stay high-quality.
- **Anti-repeat.** `partner_history` gives a decayed penalty so the same two strangers don't get paired three times in a night.

### Step 3.4 — Instant match (the hot path)

`POST /api/match/instant`:

1. Take a **Postgres advisory lock** (`pg_advisory_xact_lock(hash('matching'))`) so only one matcher runs at a time across all serverless invocations.
2. `SELECT ... FROM match_queue WHERE status='waiting' ORDER BY created_at FOR UPDATE SKIP LOCKED` — race-safe claim.
3. For the requesting user, fetch candidates in SQL by shared `subject_id` (indexed), filter to presence-alive users, hydrate, then score in TS.
4. Take the best candidate above the decayed threshold, insert the `sessions` row, insert both `session_participants` rows, flip both queue rows to `matched`, write `partner_history`, and broadcast `session:matched` on Realtime to both users.
5. If nothing clears the bar, return `{ status: 'queued', position, etaHint }` and let the batch matcher handle it.

### Step 3.5 — Batch matching ("matching waves")

Vercel Cron hits `/api/match/tick` every 30s:

1. Advisory lock, claim waiting rows (`SKIP LOCKED`).
2. Build a candidate graph where edges exist above a floor score.
3. Greedy: repeatedly take the globally highest-scoring edge, emit a pair, remove both nodes. This is not optimal like the Hungarian algorithm but is O(n²) on a pool that is realistically < 500 waiting users, and it's easy to reason about.
4. Group mode: when `mode='group'` and `max_participants > 2`, seed a cluster with the highest-degree node and add neighbours while the average edge score stays above threshold.
5. Expire waits older than 5 minutes with an honest message, not a silent timeout.

### Step 3.6 — Scheduled sessions (`/schedule`)

The existing calendar page becomes real: picking a date + peer writes a `sessions` row with `mode='scheduled'` and a pending invite. Both parties get a reminder 15 minutes before (Vercel Cron → Resend). If the invitee hasn't accepted 5 minutes before start, the session auto-cancels and the host is told.

### Step 3.7 — After the session

Short debrief modal (already the Flow Club pattern: goals at the start, debrief at the end): Did it help? 1–5 rating → updates `rating_avg`, writes `partner_history`, increments streaks, and offers "go again" (re-queue with the same subject) or "save as a partner" (which becomes a lightweight friend request feeding `/messages`).

**Instrumentation:** `match_requested → match_found → session_joined → session_completed(>10min)` in PostHog. Median time-to-match is the single number the matching work is judged on.

---

## 4. Live camera and mic — step by step

### Step 4.0 — Build the layer that doesn't need a provider (do this now)

The `/study` page already has Media Settings UI but no media code. This part is pure browser API and independent of the provider decision, so it ships first and is not wasted work:

1. `lib/media/devices.ts` — `enumerateDevices()` after permission is granted, grouping into cameras / mics / speakers, with a `devicechange` listener so unplugging a headset updates the menu.
2. `lib/media/local-stream.ts` — `getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' }, audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })`.
3. **Toggling must disable the track, not just hide it.** `track.enabled = false` keeps the device light on and the peer confused about the frozen frame; `track.stop()` releases the camera but costs a renegotiation to resume. Use: `enabled = false` for a mute you'll undo in seconds, `stop()` + re-`getUserMedia` for "camera off for the rest of the session". Publish the state to Realtime so the remote side renders an avatar instead of a black rectangle.
4. `useLocalMedia()` hook returning `{ stream, cameraOn, micOn, devices, toggleCamera, toggleMic, switchDevice, error }` with a real permission-denied state (browsers can't re-prompt; show instructions).
5. UI: a persistent media bar (mute, camera, screen share, blur, device menu, leave), plus a network-quality pill. Pre-join "check your camera" screen — Flow Club's camera-on-by-default works *because* people have already seen themselves look fine.

### Step 4.1 — The seam that keeps the provider decision open

```ts
// lib/media/provider.ts
export interface MediaProvider {
  createRoom(sessionId: string, opts: { maxParticipants: number }): Promise<{ roomName: string }>
  mintToken(sessionId: string, profileId: string, canPublish: boolean): Promise<string>
  connect(url: string, token: string): Promise<MediaSession>
}

export interface MediaSession {
  publish(stream: MediaStream): Promise<void>
  subscribe(cb: (participant: Participant, stream: MediaStream) => void): () => void
  setCameraEnabled(on: boolean): Promise<void>
  setMicEnabled(on: boolean): Promise<void>
  startScreenShare(): Promise<void>
  leave(): Promise<void>
  on(event: 'participantLeft' | 'quality' | 'reconnecting', cb: (...) => void): () => void
}
```

Everything in `app/study/*` talks to `MediaSession`, never to an SDK. Swapping providers later is one factory function.

### Step 4.2 — Rooms follow sessions

A room is never created by the client. `POST /api/sessions/:id/join` → server verifies the caller is a `session_participant`, caps headcount against `max_participants`, then calls `MediaProvider.mintToken()` server-side with a short TTL (10 min) and returns `{ url, token }`. The API secret never leaves the server, and a user can't join room names they weren't invited to.

### Step 4.3 — The provider choice (deferred, as agreed)

| Option | What it is | Pros | Cons |
|---|---|---|---|
| **LiveKit Cloud** (or self-hosted LiveKit) | Open-source SFU; React components (`@livekit/components-react`) drop straight in | Scales past 4 people, adaptive bitrate, real screen share, self-hostable so you're never locked in | Egress minutes cost money |
| **Daily Embedded / Prebuilt** | Hosted WebRTC with a prebuilt call UI | Fastest path to a working call; call-quality dashboard included | Higher per-minute price; UI is harder to make feel like ours |
| **Raw WebRTC mesh** over Supabase Realtime as signaling | Each peer connects directly to each other; no media server, no media bill | Free; full control | **Breaks above ~4 participants** — uplink scales linearly with peers; no recording, no simulcast, painful on mobile networks |

**My recommendation when you're ready:** LiveKit, self-hosted on a single small VPS at first and moved to Cloud only when concurrency justifies it. It's the only option where a 8-person group room works well *and* we're not permanently locked to a vendor. Daily is the right answer only if you want a call UI in a weekend rather than a product.

Either way, the mesh option is genuinely viable **if** you cap rooms at 2 people — that's the cheapest possible v1 and it's a legitimate choice for launch.

### Step 4.4 — Safety and quality

- Camera is opt-in per session, never forced; the room shows "camera off" states as designed avatars.
- Report / mute-peer / leave-now controls that work without the other person's cooperation.
- Background blur via a lightweight transform (off by default; it's CPU-expensive on low-end laptops).
- No recording in v1 — it's a privacy and legal surface we don't need.

---

## 5. Communities

1. `communities` seeded per subject and per university (a "Linear Algebra · Tunis El Manar" community is more useful than a generic one).
2. Post composer with three explicit kinds — **Ask for help**, **Share a resource**, **Note** — because "ask for help" needs to be solvable: an author can mark a comment as the accepted answer, which flips `posts.solved` and drives the "unsolved questions" filter that makes the community feel alive.
3. Resources: upload to a private Supabase Storage bucket, render PDFs inline with the already-vendored `react-pdf` (lazy-loaded from `components/community/pdf-lazy.tsx` — SSR-importing it breaks the build), signed URLs expire in 1 hour.
4. Realtime: new posts and comments broadcast on `community:{id}`; typing indicators via presence.
5. Moderation: per-community mods, report queue, and keyword rate limiting. Seed each community with real content before launch — an empty community is the #1 reason this feature dies.

---

## 6. The AI agent

Built as a tool-calling assistant that lives in a persistent right-hand drawer, not a separate chat page — so it's available *during* a session, which is when people are actually stuck.

Tools it gets (`lib/ai/tools.ts`):

- `findStudyPartner({ subject, when })` → enqueues a real match and reports back.
- `explainConcept({ subject, concept, depth })` → grounded explanation, formatted for the drawer.
- `summarizeResource({ postId })` → pulls a community attachment and summarizes it.
- `quizMe({ subject, topic, count })` → generates questions, grades answers, keeps score.
- `planSession({ goal, minutes })` → splits a goal into timed blocks for the study timer.
- `searchCommunity({ query })` → returns real posts with links.

Implementation: `POST /api/ai/chat` with the Vercel AI SDK's `streamText`, messages persisted to `ai_messages`, per-user daily token budget enforced in Postgres, and a hard rule that the agent can never write to `profiles` or `sessions` without going through the same server actions a user would. Refusal behaviour is tuned to say "ask your community" rather than guessing at university-specific facts.

---

## 7. Order of work

| # | Milestone | Depends on | Rough effort |
|---|---|---|---|
| 1 | Supabase project, migrations 1–6, RLS policies | — | 2–3 days |
| 2 | Real auth + middleware + onboarding writes profiles | 1 | 2–3 days |
| 3 | Presence + match queue + instant matcher + wait UI | 2 | 4–5 days |
| 4 | Batch matcher + cron + post-session debrief | 3 | 2 days |
| 5 | Local media layer (devices, toggles, pre-join) | 2 | 2–3 days |
| 6 | **Media provider decision** → wire `MediaSession` into `/study` | 5 | 2–4 days |
| 7 | Scheduled sessions + reminders (real `/schedule`) | 3 | 2 days |
| 8 | Communities: CRUD, posts, comments, solved answers | 2 | 4–5 days |
| 9 | Resource upload + inline PDF | 8 | 1–2 days |
| 10 | AI agent drawer + 6 tools | 2, 8 | 3–4 days |
| 11 | Rate limits, moderation, Sentry + PostHog, load test | all | 2–3 days |
| 12 | Seed 10 universities × 40 subjects, beta with real students | all | 1 week |

Milestones 3 and 5 are independent and can run in parallel. Nothing in 6–10 blocks on the media decision except 6 itself.

---

## 8. Open decisions

- **Media provider** — deferred by request. Everything is built so this is a one-file swap (§4.1).
- **Group rooms or 1:1 only at launch?** 1:1 is dramatically cheaper on media (mesh becomes viable) and matching is easier. Recommend launching 1:1 + scheduled groups.
- **University verification** — email-domain check is free and good enough for v1; document upload is a v2 problem.
- **Mobile** — the current UI is desktop-first. Camera sessions from phones need an explicit decision before milestone 5.

---

## 9. Environment variables (none are set yet, nothing is installed)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server only, never NEXT_PUBLIC_
DATABASE_URL=                    # for Drizzle migrations
OPENAI_API_KEY=                  # or ANTHROPIC_API_KEY
RESEND_API_KEY=
# later, once decided:
# LIVEKIT_API_KEY= / LIVEKIT_API_SECRET= / LIVEKIT_URL=
#   or DAILY_API_KEY=
```
