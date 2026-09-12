"use client"

import Link from "next/link"
import { CheckCircle2, Clock, Flame, Video } from "lucide-react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/avatar"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

// The people currently in open, joinable rooms. In production this comes from
// whatever realtime source tracks active sessions (websocket/polling).
const LIVE_NOW = [
  { name: "Alex Chen", subject: "Calculus II" },
  { name: "Emma Wilson", subject: "Biology" },
  { name: "Noah Brown", subject: "Physics" },
  { name: "Sana Benali", subject: "Statistics" },
  { name: "Yassine Trabelsi", subject: "Computer Science" },
  { name: "Nour Hadded", subject: "Organic Chemistry" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container-page py-10 sm:py-14">
        {/* ---------------- Greeting ---------------- */}
        <Reveal>
          <p className="eyebrow">Thursday, 11 September</p>
          <h1 className="mt-2 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[40px]">
            Welcome back, Sarah
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            {LIVE_NOW.length} people in your subjects are focused right now.
          </p>
        </Reveal>

        {/* ---------------- Hero action — the one thing on this page that's allowed
             to be big. Everything else is secondary to "get into a session." ---------------- */}
        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-col items-start gap-6 rounded-3xl bg-ink p-8 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="font-display text-2xl font-bold text-white sm:text-[28px]">
                Ready when you are.
              </p>
              <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-white/60">
                Get paired instantly, or drop straight into a room where someone's
                already working on your subject.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 border-white bg-white text-ink hover:bg-white/90">
              <Link href="/study">
                <Video className="h-4 w-4" />
                Start a session
              </Link>
            </Button>
          </div>
        </Reveal>

        {/* ---------------- Studying right now — the lobby. This is the actual home
             screen of the app; everything above just points here. ---------------- */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
              Studying right now
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-pulse-dark">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
              </span>
              {LIVE_NOW.length} live
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-line-strong" />
        </Reveal>

        <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_NOW.map((person) => (
            <RevealItem key={person.name}>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft">
                <Avatar name={person.name} size="md" status="online" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[14.5px] font-bold text-ink">
                    {person.name}
                  </p>
                  <p className="truncate text-[13px] text-ink-mute">{person.subject}</p>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/study">Join</Link>
                </Button>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ---------------- Your week — demoted to a quiet one-line strip. This is
             data you check occasionally, not something you need the second you
             log in, so it doesn't compete with the lobby above. ---------------- */}
        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-paper-warm px-6 py-4">
            <StripStat icon={Clock} value="8.5h" label="this week" />
            <StripStat icon={Flame} value="4-day" label="streak" />
            <StripStat icon={CheckCircle2} value="2/4" label="goals done" />
            <Link
              href="/schedule"
              className="ml-auto text-[13px] font-semibold text-ink-mute transition-colors hover:text-ink"
            >
              Full history →
            </Link>
          </div>
        </Reveal>
      </main>
    </div>
  )
}

function StripStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-ink-soft" />
      <span className="text-[13.5px] font-semibold text-ink">{value}</span>
      <span className="text-[13px] text-ink-mute">{label}</span>
    </div>
  )
}