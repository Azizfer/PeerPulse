import { FocusTimer } from "@/components/focus-timer"

export default function SoloStudyPage() {
  return <div className="min-h-screen bg-paper"><main className="container-page max-w-2xl py-10 sm:py-14"><header className="mb-8"><p className="eyebrow">Your own pace</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">Solo Pomodoro</h1><p className="mt-3 text-sm leading-7 text-ink-soft">One task at a time. Give it your attention, then take a break.</p></header><FocusTimer /><p className="mt-4 text-xs leading-6 text-ink-mute">Keep this page open while you focus. Solo time is not yet saved to your statistics.</p></main></div>
}
