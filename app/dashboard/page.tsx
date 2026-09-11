"use client"

import Link from "next/link"
import { ArrowRight, Activity, CalendarPlus, Clock, Flame, TrendingUp, Video } from "lucide-react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/avatar"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

const UPCOMING = [
  {
    id: 1,
    partner: "Alex Chen",
    subject: "Calculus II",
    topic: "Integration by parts",
    time: "Today · 3:00 PM",
    duration: "50 min",
  },
  {
    id: 2,
    partner: "Emma Wilson",
    subject: "Biology",
    topic: "Cell respiration",
    time: "Tomorrow · 10:00 AM",
    duration: "25 min",
  },
]

const RECENT = [
  { id: 1, partner: "Noah Brown", subject: "Physics problems", duration: "1h 15m", when: "2 hours ago" },
  { id: 2, partner: "Sophie Taylor", subject: "Chemistry review", duration: "45m", when: "Yesterday" },
  { id: 3, partner: "Liam Davis", subject: "Math practice", duration: "1h", when: "2 days ago" },
]

const PARTNERS = [
  { name: "Alex Chen", sessions: 12, status: "online" as const },
  { name: "Emma Wilson", sessions: 8, status: "online" as const },
  { name: "Noah Brown", sessions: 6, status: "offline" as const },
  { name: "Sana Benali", sessions: 4, status: "online" as const },
]

const STATS = [
  { label: "Study time", value: "8.5h", hint: "+2h vs last week", icon: Clock },
  { label: "Sessions", value: "6", hint: "4 focus · 2 group", icon: Video },
  { label: "Day streak", value: "4", hint: "Best: 12 days", icon: Flame },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container-page py-10 sm:py-14">
        {/* ---------------- Greeting ---------------- */}
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Thursday, 11 September</p>
              <h1 className="mt-2 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[40px]">
                Welcome back, Sarah
              </h1>
              <p className="mt-2 text-[15px] text-ink-soft">
                Three people in your subjects are in a focus room right now.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/study">
                  <Video className="h-4 w-4" />
                  Start a focus session
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/schedule">
                  <CalendarPlus className="h-4 w-4" />
                  Schedule
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* ---------------- Stats — bare row, matches the landing page's stats treatment
             instead of three separate white bordered/shadowed cards ---------------- */}
        <Reveal delay={0.04}>
          <div className="mt-10 rounded-3xl bg-paper-warm px-6 py-7 sm:px-9">
            <div className="grid grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-start gap-3">
                  <span className="mt-1 text-ink-soft">
                    <stat.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[26px] font-extrabold leading-none tracking-tight text-ink sm:text-[30px]">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-[13px] font-medium text-ink-soft">{stat.label}</p>
                    <p className="text-[12px] text-ink-faint">{stat.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------------- Pulse suggestion ---------------- */}
        <Reveal delay={0.08}>
          <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-pulse/25 bg-pulse-soft/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-surface text-pulse-dark shadow-soft">
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-[15px] font-bold text-pulse-dark">
                  You struggle most with series convergence
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-pulse-dark/80">
                  Pulse built a 30-minute plan and found two peers working on the same topic
                  today. Want the room booked for 3 PM?
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="accent">
                Book it
              </Button>
              <Button asChild size="sm" variant="ghost" className="text-pulse-dark hover:bg-pulse/10">
                <Link href="/study">Not now</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* ---------------- Main grid ---------------- */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          {/* -------- Left -------- */}
          <div className="space-y-10">
            {/* Primary panel — the one thing you're most likely to act on, so it keeps
                the boxed treatment for visual weight. */}
            <Reveal>
              <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    Upcoming sessions
                  </h2>
                  <Link
                    href="/schedule"
                    className="text-[13.5px] font-semibold text-ink-mute transition-colors hover:text-ink"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {UPCOMING.map((session) => (
                    <div
                      key={session.id}
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft"
                    >
                      <Avatar name={session.partner} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[15px] font-bold text-ink">
                          {session.partner}
                        </p>
                        <p className="truncate text-[13.5px] text-ink-mute">
                          {session.subject} · {session.topic}
                        </p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="text-[13.5px] font-semibold text-ink">{session.time}</p>
                        <p className="text-[12.5px] text-ink-mute">{session.duration}</p>
                      </div>
                      <Button asChild size="sm" variant="secondary">
                        <Link href="/study">Join</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Secondary content — de-boxed. It's glanceable history, not something you act
                on, so it doesn't need its own white bordered/shadowed card. Same bare
                "heading, rule, list" language as the landing page's steps/features. */}
            <Reveal delay={0.06}>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    Recent sessions
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-pulse-dark">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +18% this week
                  </span>
                </div>
                <div className="mt-3 h-px w-full bg-line-strong" />

                <div className="mt-2 divide-y divide-line">
                  {RECENT.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 py-3.5">
                      <Avatar name={session.partner} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-semibold text-ink">
                          {session.partner}
                        </p>
                        <p className="truncate text-[13px] text-ink-mute">{session.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13.5px] font-semibold text-ink">{session.duration}</p>
                        <p className="text-[12.5px] text-ink-mute">{session.when}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          </div>

          {/* -------- Right -------- */}
          <div className="space-y-10">
            {/* Second primary panel — a real navigation widget (status dots, links out to
                /explore), earns the boxed treatment same as Upcoming sessions. */}
            <Reveal delay={0.1}>
              <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    Study partners
                  </h2>
                  <Link
                    href="/explore"
                    className="text-[13.5px] font-semibold text-ink-mute transition-colors hover:text-ink"
                  >
                    Find more
                  </Link>
                </div>

                <div className="mt-5 space-y-1">
                  {PARTNERS.map((partner) => (
                    <div
                      key={partner.name}
                      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-surface-sunken"
                    >
                      <Avatar name={partner.name} size="sm" status={partner.status} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-semibold text-ink">
                          {partner.name}
                        </p>
                        <p className="text-[12.5px] text-ink-mute">{partner.sessions} sessions</p>
                      </div>
                      {partner.status === "online" && (
                        <Badge variant="accent" className="hidden sm:inline-flex">
                          Available
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* De-boxed, same reasoning as Recent sessions — a checklist doesn't need a
                colored container to read clearly. */}
            <Reveal delay={0.14}>
              <section>
                <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                  This week&apos;s goals
                </h2>
                <div className="mt-3 h-px w-full bg-line-strong" />
                <ul className="mt-5 space-y-3">
                  {[
                    { text: "Finish problem set 7", done: true },
                    { text: "Review integration by parts", done: true },
                    { text: "Two past-paper sections", done: false },
                    { text: "Book a room with Alex", done: false },
                  ].map((goal) => (
                    <li key={goal.text} className="flex items-center gap-3">
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
                            ? "text-[14px] text-ink-mute line-through"
                            : "text-[14px] font-medium text-ink"
                        }
                      >
                        {goal.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/community"
                  className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink transition-colors hover:text-ink-soft"
                >
                  Open community feed
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  )
}