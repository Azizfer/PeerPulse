// Adapted from Studio Admin summary-cards.tsx (MIT).
// Copyright (c) 2024 Mohammed Arham Khan. See licenses/studio-admin-MIT.txt.
import Link from "next/link"
import { ArrowUpRight, CheckCircle2, Clock3, UsersRound } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StudySummary({ completed, total }: { completed: number; total: number }) {
  const items = [
    { title: "Focus this week", value: "8.5", unit: "hours", description: "A little progress, every day", icon: Clock3, href: "/profile" },
    { title: "Today's goals", value: String(completed), unit: `of ${total} complete`, description: total === completed ? "All goals complete" : `${total - completed} ${total - completed === 1 ? "goal" : "goals"} to keep moving`, icon: CheckCircle2, href: "#study-goals" },
    { title: "Studying now", value: "3", unit: "peers", description: "Working on your subjects", icon: UsersRound, href: "#study-peers" },
  ]
  return <div className="grid gap-3 sm:grid-cols-3">
    {items.map(item => <Card key={item.title} className="rounded-2xl shadow-none">
      <CardHeader className="p-4 pb-3"><CardTitle className="flex items-center gap-2 text-xs font-medium text-ink-soft"><span className="grid size-7 place-items-center rounded-lg border border-line bg-surface-sunken"><item.icon className="size-3.5" strokeWidth={1.7} /></span>{item.title}</CardTitle></CardHeader>
      <CardContent className="px-4 pb-4"><p className="flex flex-wrap items-baseline gap-2"><span className="font-display text-3xl font-bold leading-none tracking-tight text-ink tabular-nums">{item.value}</span><span className="text-xs text-ink-mute">{item.unit}</span></p><Link href={item.href} className="mt-4 flex items-center justify-between gap-2 text-[11px] text-ink-mute hover:text-pulse-dark">{item.description}<ArrowUpRight className="size-3.5 shrink-0" /></Link></CardContent>
    </Card>)}
  </div>
}
