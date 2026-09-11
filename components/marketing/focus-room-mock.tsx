"use client"

import { useEffect, useState } from "react"
import { MicOff, Pause, Maximize2, Video, Radio } from "lucide-react"
import { Avatar } from "@/components/avatar"

const SESSION_LENGTH = 25 * 60 // 25:00 sessions, matches the real focus-room default

/** A high-fidelity mock of the live focus room. Timer and progress are live so it
 *  reads as an actual in-progress session rather than a static screenshot. */
export function FocusRoomMock() {
  // Starts already well into the session (~5:30 left) so the card reads as "mid-flow"
  // rather than just-started — matches the mostly-full progress bar.
  const [secondsLeft, setSecondsLeft] = useState(5 * 60 + 30)

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? SESSION_LENGTH : prev - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const seconds = String(secondsLeft % 60).padStart(2, "0")
  const progressPct = ((SESSION_LENGTH - secondsLeft) / SESSION_LENGTH) * 100

  return (
    <div className="relative">
      {/* soft glows behind the card */}
      <div className="glow-soft -left-10 -top-12 h-56 w-56 bg-pulse/25" />
      <div className="glow-soft -bottom-10 -right-8 h-52 w-52 bg-lilac-deep/20" />

      <div className="relative rounded-[28px] border border-line bg-surface p-3 shadow-lift">
        {/* window chrome */}
        <div className="flex items-center justify-between px-3 pb-3 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </div>
          <p className="font-display text-[13px] font-semibold text-ink-soft">
            Calculus II · Focus room
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-deep">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-deep/60" />
              <Radio className="relative h-2.5 w-2.5" />
            </span>
            Live
          </span>
        </div>

        {/* video grid */}
        <div className="grid grid-cols-2 gap-3">
          <VideoTile name="You" subject="Calculus II" tint="lilac" muted={false} you />
          <VideoTile name="Alex Chen" subject="Calculus II" tint="pulse" muted />
        </div>

        {/* timer + goals */}
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl bg-surface-sunken p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-ink">
                {minutes}:{seconds}
              </p>
              <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink-mute">
                Deep work
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-1000 ease-linear"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-ink/85">
                <Pause className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-sunken">
                <Video className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-sunken">
                <MicOff className="h-4 w-4" />
              </button>
              <button className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-sunken">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-sunken p-4">
            <p className="eyebrow mb-3">Session goals</p>
            <ul className="space-y-2.5">
              {[
                { text: "Finish problem set 7", done: true },
                { text: "Review integration by parts", done: true },
                { text: "Quiz each other on series", done: false },
              ].map((goal) => (
                <li key={goal.text} className="flex items-center gap-2.5">
                  <span
                    className={
                      goal.done
                        ? "grid h-5 w-5 shrink-0 place-items-center rounded-[7px] bg-ink text-white"
                        : "h-5 w-5 shrink-0 rounded-[7px] border border-line-strong bg-surface"
                    }
                  >
                    {goal.done && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={
                      goal.done
                        ? "text-[13.5px] text-ink-mute line-through"
                        : "text-[13.5px] font-medium text-ink"
                    }
                  >
                    {goal.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoTile({
  name,
  subject,
  tint,
  muted,
  you,
}: {
  name: string
  subject: string
  tint: "lilac" | "pulse"
  muted: boolean
  you?: boolean
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
      <div
        className={
          tint === "lilac"
            ? "absolute -left-6 -top-10 h-28 w-28 rounded-full bg-lilac-deep/40 blur-2xl"
            : "absolute -left-6 -top-10 h-28 w-28 rounded-full bg-pulse/30 blur-2xl"
        }
      />
      <div
        className={
          tint === "lilac"
            ? "absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-pulse/25 blur-2xl"
            : "absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-lilac-deep/35 blur-2xl"
        }
      />
      <div className="relative grid h-full place-items-center">
        <Avatar name={name} size="xl" className="ring-4 ring-white/10" />
      </div>

      <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="truncate text-[12px] font-semibold text-white">
          {name}
          {you && " (you)"}
        </span>
        {muted && <MicOff className="h-3.5 w-3.5 text-white/80" />}
      </div>
      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
        {subject}
      </span>
    </div>
  )
}