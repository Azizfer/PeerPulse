"use client"

// Workspace composition adapted from Studio Admin productivity/page.tsx (MIT).
// Copyright (c) 2024 Mohammed Arham Khan. See licenses/studio-admin-MIT.txt.
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronRight, Clock3, FileText, MessageCircle, Timer, UsersRound, Video } from "lucide-react"
import { Avatar } from "@/components/avatar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudySummary } from "./_components/study-summary"
import { StudyGoals, type StudyGoal } from "./_components/study-goals"

const subjects = [
  { name: "Calculus II", subject: "Mathematics", topic: "Integration by parts" },
  { name: "Algorithms", subject: "Computer Science", topic: "Dynamic programming" },
  { name: "Statistics", subject: "Mathematics", topic: "Hypothesis testing" },
]
const peers = [
  { name: "Alex Chen", subject: "Calculus II", topic: "Integration by parts", time: "18 min left" },
  { name: "Yassine Trabelsi", subject: "Algorithms", topic: "Dynamic programming", time: "22 min left" },
  { name: "Sana Benali", subject: "Statistics", topic: "Hypothesis testing", time: "Just started" },
]
const initialGoals: StudyGoal[] = [
  { id: "calculus", title: "Finish problem set 7", tag: "Calculus II", checked: true },
  { id: "algorithms", title: "Review dynamic programming notes", tag: "Algorithms", checked: false },
  { id: "statistics", title: "Answer Sana's statistics question", tag: "Community", checked: false },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState(initialGoals)
  const [subjectIndex, setSubjectIndex] = useState(0)
  const chosenSubject = subjects[subjectIndex]
  const completed = goals.filter(goal => goal.checked).length
  const studyLink = `/study?subject=${encodeURIComponent(chosenSubject.subject)}&topic=${encodeURIComponent(chosenSubject.topic)}`
  return (
    <div className="bg-paper">
      <main className="container-page max-w-7xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-[11px] font-medium text-ink-mute">A little progress, every day.</p><h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.035em] text-ink sm:text-[32px]">Make room for a good study day, {user?.name?.split(" ")[0] || "Sarah"}.</h1><p className="mt-2 text-[13px] leading-6 text-ink-soft">Your subjects, your people, and a little more focus.</p></div>
          <Button asChild variant="secondary" size="sm" className="h-9 rounded-lg text-xs hover:translate-y-0"><Link href="/schedule"><CalendarDays className="size-3.5" />Plan a session</Link></Button>
        </header>

        <StudySummary completed={completed} total={goals.length} />

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
          <section className="flex min-w-0 flex-col gap-6" aria-label="Your study workspace">
            <section className="relative overflow-hidden rounded-2xl bg-[var(--workspace-focus)] p-5 text-white sm:p-6">
              <div className="pointer-events-none absolute -right-10 -top-12 size-60 rounded-full border border-white/10" aria-hidden="true"><div className="absolute inset-7 rounded-full border border-white/10" /><div className="absolute inset-14 rounded-full border border-white/10" /></div>
              <div className="relative">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200"><span className="size-1.5 rounded-full bg-emerald-300" />Better together</p>
                <h2 className="mt-3 max-w-sm font-display text-[24px] font-semibold leading-tight tracking-tight sm:text-[27px]">What are we learning today?</h2>
                <p className="mt-2 max-w-md text-xs leading-6 text-white/65">A familiar subject. A fresh perspective. Find a peer and work through it together.</p>
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Choose a study subject">{subjects.map((subject, index) => <button key={subject.name} type="button" onClick={() => setSubjectIndex(index)} aria-pressed={subjectIndex === index} className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 ${subjectIndex === index ? "border-white bg-white text-emerald-950" : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"}`}>{subject.name}</button>)}</div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button asChild size="sm" className="h-10 rounded-lg bg-white px-4 text-xs text-emerald-950 hover:translate-y-0 hover:bg-emerald-50"><Link href={studyLink}><Video className="size-3.5" />Find a study partner<ArrowRight className="size-3.5" /></Link></Button>
                  <Link href="/study/solo" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium text-white/70 transition-colors hover:text-white">Or focus on your own<ChevronRight className="size-3" /></Link>
                </div>
              </div>
            </section>

            <StudyGoals items={goals} onChange={setGoals} />

            <section id="study-peers" className="scroll-mt-20">
              <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-base font-bold text-ink">A little company</h2><span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-pulse-dark"><span className="size-1.5 rounded-full bg-pulse" />3 studying now</span></div>
              <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {peers.map((peer, index) => <div key={peer.name} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <Avatar name={peer.name} size="sm" status="online" className="scale-90" />
                  <div className="min-w-0"><p className="truncate text-xs font-semibold leading-5 text-ink">{peer.name}</p><p className="mt-0.5 truncate text-[11px] leading-5 text-ink-mute">{peer.subject} · {peer.topic}</p></div>
                  <div className="flex items-center gap-3"><span className="hidden text-[10px] text-ink-mute sm:block">{peer.time}</span><Button asChild variant="secondary" size="sm" className="h-8 rounded-lg px-3 text-[11px] hover:translate-y-0"><Link href={`/study?subject=${encodeURIComponent(subjects[index].subject)}&topic=${encodeURIComponent(peer.topic)}`}>Study<ArrowUpRight className="size-3" /></Link></Button></div>
                </div>)}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-base font-bold text-ink">From your communities</h2><Link href="/community" className="text-[11px] font-medium text-ink-mute hover:text-pulse-dark">Open feed <span aria-hidden="true">↗</span></Link></div>
              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                {[{ title: "When should I use integration by parts twice?", detail: "Calculus II · 6 replies", icon: MessageCircle, href: "/community" }, { title: "Dynamic programming patterns cheat sheet", detail: "Algorithms · Shared resource", icon: FileText, href: "/community" }].map(item => <Link key={item.title} href={item.href} className="flex items-center gap-3 border-b border-line p-4 last:border-0 hover:bg-surface-sunken"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-sunken text-pulse-dark"><item.icon className="size-3.5" strokeWidth={1.7} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-medium leading-5 text-ink">{item.title}</span><span className="mt-0.5 block text-[10px] text-ink-mute">{item.detail}</span></span><ArrowUpRight className="size-3.5 shrink-0 text-ink-mute" /></Link>)}
              </div>
            </section>
          </section>

          <aside className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="rounded-2xl shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-3"><CardTitle className="text-sm">On your schedule</CardTitle><CalendarDays className="size-3.5 text-ink-mute" /></CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="rounded-xl border border-line bg-surface-sunken p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-medium text-ink-mute">Next session</span><span className="rounded-md bg-surface px-2 py-1 text-[10px] font-semibold text-pulse-dark">18:30</span></div><h3 className="mt-3 text-[13px] font-semibold text-ink">Algorithms group</h3><p className="mt-1 text-[11px] leading-5 text-ink-soft">Dynamic programming review</p><div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-[10px] text-ink-mute"><UsersRound className="size-3" />4 participants<span className="ml-auto inline-flex items-center gap-1"><Clock3 className="size-3" />45 min</span></div></div>
                <Link href="/schedule" className="mt-4 flex items-center justify-between text-[11px] font-medium text-ink-soft hover:text-pulse-dark">View your schedule<ArrowRight className="size-3" /></Link>
              </CardContent>
            </Card>

            {/* Adapted from Studio Admin focus-card.tsx, with PeerPulse's solo route. */}
            <Card className="rounded-2xl shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-3"><CardTitle className="text-sm">Just you and the task.</CardTitle><Timer className="size-3.5 text-ink-mute" /></CardHeader>
              <CardContent className="px-4 pb-4"><div className="flex items-center justify-between gap-3"><span className="font-display text-3xl font-semibold tracking-tight text-ink tabular-nums">25:00</span><Button asChild variant="subtle" size="sm" className="h-8 rounded-lg px-3 text-[11px] hover:translate-y-0"><Link href="/study/solo">Open timer</Link></Button></div><p className="mt-3 text-[10px] leading-5 text-ink-mute">One Pomodoro. One small step forward.</p></CardContent>
            </Card>

            <Card className="rounded-2xl shadow-none">
              <CardHeader className="p-4 pb-3"><CardTitle className="text-sm">Small wins add up.</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4"><div className="flex items-baseline gap-1.5"><span className="font-display text-2xl font-bold text-ink">{completed}</span><span className="text-xs text-ink-mute">of {goals.length} goals complete</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-sunken" role="progressbar" aria-label="Today's goal progress" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={goals.length}><div className="h-full rounded-full bg-pulse transition-[width]" style={{ width: `${goals.length ? completed / goals.length * 100 : 0}%` }} /></div><p className="mt-3 text-[10px] leading-5 text-ink-mute">Keep it manageable. Consistency beats a perfect plan.</p></CardContent>
            </Card>

            <div className="space-y-1 rounded-2xl border border-line bg-surface p-2">
              {[{ title: "Join a group room", icon: UsersRound, href: "/study/groups" }, { title: "Find a community", icon: MessageCircle, href: "/communities" }, { title: "Your study materials", icon: BookOpen, href: "/explore" }].map(item => <Link key={item.href} href={item.href} className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-[11px] font-medium text-ink-soft hover:bg-surface-sunken hover:text-ink"><item.icon className="size-3.5 text-ink-mute" strokeWidth={1.7} />{item.title}<ChevronRight className="ml-auto size-3" /></Link>)}
            </div>
          </aside>
        </div>
        <p className="mt-6 text-[10px] leading-5 text-ink-mute">Preview workspace · activity and peers are examples. Your goal changes are local to this page.</p>
      </main>
    </div>
  )
}
