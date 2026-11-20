"use client"

import { Mic, MicOff, Pause, Maximize2, Video, Radio } from "lucide-react"

/** A static, high-fidelity mock of the live focus room (no media APIs involved). */
export function FocusRoomMock() {
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
            <Radio className="h-3 w-3" />
            Live
          </span>
        </div>

        {/* video grid */}
        <div className="grid grid-cols-2 gap-3">
          <VideoTile name="You" subject="Calculus II" variant="you" muted={false} you />
          <VideoTile name="Alex Chen" subject="Calculus II" variant="alex" muted />
        </div>

        {/* timer + goals */}
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl bg-surface-sunken p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-ink">
                24:07
              </p>
              <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink-mute">
                Deep work
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full w-[78%] rounded-full bg-ink" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper">
                <Pause className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft">
                <Video className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft">
                <MicOff className="h-4 w-4" />
              </button>
              <button className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft">
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
                        ? "grid h-5 w-5 shrink-0 place-items-center rounded-[7px] bg-ink text-paper"
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
  variant,
  muted,
  you,
}: {
  name: string
  subject: string
  variant: "you" | "alex"
  muted: boolean
  you?: boolean
}) {
  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#12151a]">
      <ParticipantScene variant={variant} />

      <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="truncate text-[12px] font-semibold text-white">
          {name}
          {you && " (you)"}
        </span>
        {muted ? (
          <MicOff className="h-3.5 w-3.5 text-white/80" />
        ) : (
          <Mic className="h-3.5 w-3.5 text-white/80" />
        )}
      </div>
      <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/90 backdrop-blur-md">
        <span className={`h-1.5 w-1.5 rounded-full ${variant === "you" ? "bg-[#c9b8ff]" : "bg-[#72dfc3]"}`} />
        {subject}
      </span>
    </div>
  )
}

function ParticipantScene({ variant }: { variant: "you" | "alex" }) {
  const isYou = variant === "you"
  const id = `participant-${variant}`

  return (
    <svg
      viewBox="0 0 360 270"
      aria-hidden="true"
      className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={isYou ? "#24223a" : "#17302f"} />
          <stop offset="1" stopColor={isYou ? "#121923" : "#171a27"} />
        </linearGradient>
        <linearGradient id={`${id}-desk`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor={isYou ? "#b5a0f8" : "#62d6b6"} />
          <stop offset="1" stopColor={isYou ? "#7b68bd" : "#348f80"} />
        </linearGradient>
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={isYou ? "#f5d98e" : "#c8b8ff"} />
          <stop offset="1" stopColor={isYou ? "#d6a952" : "#806cd5"} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor={isYou ? "#c6b7ff" : "#79e0c5"} stopOpacity=".34" />
          <stop offset="1" stopColor={isYou ? "#c6b7ff" : "#79e0c5"} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="270" fill={`url(#${id}-wall)`} />
      <circle cx={isYou ? 72 : 292} cy="58" r="94" fill={`url(#${id}-glow)`} />

      {isYou ? (
        <>
          <rect x="22" y="36" width="78" height="92" rx="8" fill="#12151e" stroke="#ffffff" strokeOpacity=".1" />
          <rect x="30" y="44" width="62" height="62" rx="4" fill="#ebe5ff" fillOpacity=".1" />
          <path d="M39 92 54 73l10 12 10-17 12 24Z" fill="#c5b4ff" fillOpacity=".55" />
          <circle cx="78" cy="59" r="7" fill="#f4d68c" />
          <rect x="31" y="114" width="60" height="3" rx="1.5" fill="#ffffff" fillOpacity=".12" />
          <path d="M309 29v84M282 55h55M288 83h43" stroke="#ffffff" strokeOpacity=".12" strokeWidth="5" strokeLinecap="round" />
          <rect x="300" y="42" width="18" height="11" rx="2" fill="#f2d984" fillOpacity=".55" />
          <rect x="291" y="69" width="28" height="10" rx="2" fill="#a998ea" fillOpacity=".58" />
          <rect x="307" y="96" width="20" height="10" rx="2" fill="#79d9c0" fillOpacity=".48" />
        </>
      ) : (
        <>
          <rect x="22" y="30" width="104" height="79" rx="9" fill="#d9fff6" fillOpacity=".08" stroke="#ffffff" strokeOpacity=".1" />
          <path d="M72 30v79M22 69h104" stroke="#ffffff" strokeOpacity=".09" strokeWidth="3" />
          <circle cx="101" cy="50" r="13" fill="#f4d887" fillOpacity=".75" />
          <path d="M26 91c17-20 33-27 49-18 12 7 21 9 47-5v37H26Z" fill="#65d8b8" fillOpacity=".3" />
          <rect x="285" y="35" width="48" height="68" rx="5" fill="#101719" stroke="#ffffff" strokeOpacity=".1" />
          <path d="m296 76 10-14 8 9 8-18" fill="none" stroke="#77dfc4" strokeOpacity=".65" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="296" cy="50" r="4" fill="#cabdff" fillOpacity=".8" />
        </>
      )}

      <ellipse cx="180" cy="255" rx="150" ry="25" fill="#07090c" fillOpacity=".35" />

      {/* chair and person */}
      <rect x="143" y="143" width="76" height="91" rx="34" fill={isYou ? "#353343" : "#303347"} />
      <path d="M119 260c4-58 24-91 61-91s58 33 61 91Z" fill={`url(#${id}-shirt)`} />
      <path d="M136 260c5-35 18-55 44-61 26 6 39 26 44 61Z" fill="#000000" fillOpacity=".08" />
      <rect x="168" y="144" width="25" height="32" rx="10" fill={isYou ? "#d99564" : "#985c43"} />
      <ellipse cx="180" cy="125" rx="39" ry="46" fill={isYou ? "#e7a171" : "#ad6b4c"} />

      {isYou ? (
        <>
          <path d="M143 125c-4-34 12-58 41-58 25 0 42 17 38 48-7-5-12-14-15-25-14 16-35 23-64 22Z" fill="#32282c" />
          <path d="M145 111c-7 3-9 10-6 18 2 6 6 9 11 9" fill="#e7a171" />
          <path d="M217 111c7 3 9 10 6 18-2 6-6 9-11 9" fill="#e7a171" />
          <path d="M164 126h10M188 126h10" stroke="#35282a" strokeWidth="3" strokeLinecap="round" />
          <path d="M173 148c5 4 11 4 16 0" fill="none" stroke="#9b4f4d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M145 101c7-27 22-38 45-34" fill="none" stroke="#4b3940" strokeWidth="9" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M141 122c-2-37 13-59 42-59 28 0 43 21 38 57-5-16-17-25-28-30-14 13-30 20-52 19Z" fill="#151417" />
          <path d="M153 88c8-20 26-27 45-20 13 5 21 17 23 35" fill="none" stroke="#242126" strokeWidth="12" strokeLinecap="round" />
          <path d="M161 125h10M190 125h10" stroke="#291b18" strokeWidth="3" strokeLinecap="round" />
          <path d="M171 147c6 3 12 3 18-1" fill="none" stroke="#71382e" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M146 123c-7 0-10 6-8 13 2 6 7 9 12 7M215 123c7 0 10 6 8 13-2 6-7 9-12 7" fill={isYou ? "#e7a171" : "#ad6b4c"} />
        </>
      )}

      {/* study desk and objects */}
      <rect x="0" y="228" width="360" height="42" fill="#0a0c10" fillOpacity=".72" />
      <rect x="0" y="225" width="360" height="7" fill={`url(#${id}-desk)`} />
      <path d="M230 179h81l-7 48h-68Z" fill="#20242a" stroke="#ffffff" strokeOpacity=".18" strokeWidth="2" />
      <circle cx="271" cy="203" r="6" fill={isYou ? "#c4b4ff" : "#6edcc0"} fillOpacity=".7" />
      <path d="M219 228h103" stroke="#41464d" strokeWidth="5" strokeLinecap="round" />
      <path d="M34 217h68M42 209h60M48 201h54" stroke={isYou ? "#f2d782" : "#c4b6ff"} strokeWidth="7" strokeLinecap="round" />
      <rect x="49" y="190" width="52" height="6" rx="3" fill={isYou ? "#72d9be" : "#68d8bb"} />
      <path d="M116 228c0-17 8-28 18-28s18 11 18 28" fill="none" stroke="#ffffff" strokeOpacity=".18" strokeWidth="3" />
      <path d="M124 204c-6-14-2-24 10-31 4 14 4 24 0 29M139 202c4-13 12-19 23-18-3 13-11 20-23 22" fill={isYou ? "#70d5b8" : "#c2b2ff"} fillOpacity=".72" />
    </svg>
  )
}
