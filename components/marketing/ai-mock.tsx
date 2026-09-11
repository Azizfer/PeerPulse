import { Send, Sparkles } from "lucide-react"

/** Static mock of the Pulse AI assistant panel. */
export function AiMock() {
  return (
    <div className="relative">
      <div className="glow-soft -right-10 -top-10 h-52 w-52 bg-lilac-deep/20" />

      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface shadow-lift">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink">Pulse</p>
            <p className="text-[12px] text-ink-mute">Your study assistant</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-pulse-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pulse-dark">
            Online
          </span>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[14px] leading-relaxed text-white">
            I have a Linear Algebra midterm Thursday. Make me a 3-day plan with the 6 topics
            I keep failing.
          </div>

          <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-surface-sunken px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
            <p className="mb-2 font-display text-[13px] font-bold text-ink">
              Here&apos;s a plan built around your weak spots:
            </p>
            <ol className="space-y-1.5">
              {[
                "Day 1 — Eigenvalues & eigenvectors (90 min + 10 practice Qs)",
                "Day 2 — Diagonalization, then mixed problem set",
                "Day 3 — Timed past paper + review only what you missed",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-pulse">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[13px] text-ink-mute">
              Want me to book a focus room with someone also doing Linear Algebra?
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Book the room", "Quiz me on eigenvalues", "Find past papers"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-line-strong bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink-soft"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line px-4 py-3">
          <span className="flex-1 rounded-full bg-surface-sunken px-4 py-2.5 text-[13.5px] text-ink-faint">
            Ask Pulse anything…
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pulse text-white">
            <Send className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  )
}
