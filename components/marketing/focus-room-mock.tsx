"use client"

import { MicOff, Pause, Maximize2, Video, VideoOff, Radio } from "lucide-react"
import { Avatar } from "@/components/avatar"

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
          <VideoTile name="You" subject="Calculus II" tint="lilac" muted={false} you />
          <VideoTile name="Alex Chen" subject="Calculus II" tint="pulse" muted />
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
              <button className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white">
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

      {/* floating chips */}
      <FloatingChip className="-left-6 bottom-16 hidden sm:block">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-pulse" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
        </span>
        Matched in 8 seconds
      </FloatingChip>

      <FloatingChip className="-right-4 top-1/2 hidden md:block">
        <span className="text-base leading-none">🔥</span>
        12-day streak
      </FloatingChip>
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
        {muted ? (
          <MicOff className="h-3.5 w-3.5 text-white/80" />
        ) : (
          <VideoOff className="h-3.5 w-3.5 text-white/40" />
        )}
      </div>
      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
        {subject}
      </span>
    </div>
  )
}

function FloatingChip({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`absolute z-10 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-display text-[13px] font-semibold text-ink shadow-card ${className ?? ""}`}
    >
      {children}
    </div>
  )
}
