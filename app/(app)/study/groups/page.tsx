"use client"

import { useState } from "react"
import { UsersRound, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FocusTimer } from "@/components/focus-timer"
const rooms = [
  { id: 1, title: "Algorithms practice", subject: "Computer Science", people: 3, limit: 6 },
  { id: 2, title: "Quiet calculus room", subject: "Mathematics", people: 2, limit: 4 },
  { id: 3, title: "Organic chemistry review", subject: "Chemistry", people: 4, limit: 6 },
]
export default function GroupStudyPage() {
  const [active, setActive] = useState<typeof rooms[number] | null>(null)
  return <div className="min-h-screen bg-paper"><main className="container-page max-w-4xl py-10 sm:py-14">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Focus together</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">Group sessions</h1><p className="mt-3 text-sm leading-7 text-ink-soft">Explore a subject room or try a randomly selected group.</p></div>{!active && <Button variant="accent" onClick={() => setActive(rooms[Math.floor(Math.random() * rooms.length)])}><Shuffle className="size-4" /> Random group</Button>}</header>
    {active ? <div className="mx-auto max-w-2xl"><div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4"><div><h2 className="text-sm font-semibold text-ink">{active.title}</h2><p className="mt-1 text-xs text-ink-mute">{active.subject} · Room preview</p></div><Button variant="outline" size="sm" onClick={() => setActive(null)}>Leave room</Button></div><FocusTimer /></div> : <div className="grid gap-4 sm:grid-cols-3">{rooms.map(room => <article key={room.id} className="rounded-3xl border border-line bg-surface p-5 shadow-soft"><span className="grid size-9 place-items-center rounded-xl bg-surface-sunken text-pulse-dark"><UsersRound className="size-4" /></span><p className="mt-5 text-[11px] text-ink-mute">{room.subject}</p><h2 className="mt-2 text-base font-semibold text-ink">{room.title}</h2><p className="mt-3 text-xs text-ink-soft">{room.people} / {room.limit} example participants</p><Button variant="secondary" className="mt-5 w-full" onClick={() => setActive(room)}>Preview room</Button></article>)}</div>}
    <p className="mt-6 text-xs leading-6 text-ink-mute">Demo rooms · no real participants or shared timers are connected yet.</p>
  </main></div>
}
