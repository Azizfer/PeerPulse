"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { Avatar } from "@/components/avatar"
import { CalendarDays, Clock3, ChevronLeft, ChevronRight, Plus, Search, Check, UsersRound, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-select"
import { TimeInput } from "@/components/ui/time-input"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter } from "@/components/ui/drawer"

interface Friend {
  id: string
  name: string
  status: "online" | "offline"
}

interface Session {
  id: string
  date: Date
  duration: string
  topic: string
  friend: Friend
}

const friends: Friend[] = [
  { id: "1", name: "Alex Chen", status: "online" },
  { id: "2", name: "Emma Wilson", status: "online" },
  { id: "3", name: "Noah Brown", status: "offline" },
  { id: "4", name: "Sophie Taylor", status: "online" },
  { id: "5", name: "Liam Davis", status: "offline" },
]

const durations = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours", "2.5 hours", "3 hours"]
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const dateLabel = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

function withTime(date: Date, time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour < 1 || hour > 12 || minute > 59) return null
  const result = new Date(date)
  result.setHours(hour % 12 + (match[3].toUpperCase() === "PM" ? 12 : 0), minute, 0, 0)
  return result
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [sessionTime, setSessionTime] = useState("")
  const [sessionDuration, setSessionDuration] = useState("1 hour")
  const [sessionTopic, setSessionTopic] = useState("")
  const [error, setError] = useState("")
  const [confirmation, setConfirmation] = useState("")

  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const upcoming = sessions.filter(session => session.date >= today).sort((a, b) => a.date.getTime() - b.date.getTime())
  const monthSessions = sessions.filter(session => session.date.getMonth() === currentDate.getMonth() && session.date.getFullYear() === currentDate.getFullYear())
  const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const canSchedule = Boolean(selectedFriend && sessionTime && sessionTopic.trim())

  const openScheduler = (date: Date) => {
    setSelectedDate(date)
    setSelectedFriend(null)
    setSessionTime("")
    setSessionDuration("1 hour")
    setSessionTopic("")
    setSearchQuery("")
    setError("")
    setIsOpen(true)
  }

  const scheduleSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedFriend || !sessionTime || !sessionTopic.trim()) {
      setError("Choose a partner, a time, and a topic to continue.")
      return
    }
    const start = withTime(selectedDate, sessionTime)
    if (!start || start <= new Date()) {
      setError("Choose a start time in the future.")
      return
    }
    setSessions(previous => [...previous, {
      id: crypto.randomUUID(), date: start, duration: sessionDuration,
      topic: sessionTopic.trim(), friend: selectedFriend,
    }])
    setCurrentDate(new Date(start.getFullYear(), start.getMonth(), 1))
    setConfirmation(`Session added for ${dateLabel(start)} at ${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}.`)
    setIsOpen(false)
  }

  return (
    <div className="min-h-screen bg-paper">
      <main className="container-page max-w-5xl py-10 sm:py-14">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Make time to focus</p>
            <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[40px]">Your study schedule.</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink-soft">A little planning. A good study partner. Space to get things done.</p>
          </div>
          <Button variant="accent" onClick={() => openScheduler(today)}><Plus className="size-4" strokeWidth={1.8} /> Schedule a session</Button>
        </header>

        {confirmation && <p role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-pulse/20 bg-pulse-soft px-4 py-3 text-sm text-pulse-dark"><Check className="size-4 shrink-0" />{confirmation}</p>}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5 sm:p-6">
              <div>
                <h2 aria-live="polite" className="font-display text-xl font-bold tracking-tight text-ink">{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
                <p className="mt-1 text-xs text-ink-mute">{monthSessions.length} {monthSessions.length === 1 ? "session" : "sessions"} planned this month</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                <Button variant="outline" size="icon-sm" aria-label="Previous month" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}><ChevronLeft className="size-4" /></Button>
                <Button variant="outline" size="icon-sm" aria-label="Next month" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}><ChevronRight className="size-4" /></Button>
              </div>
            </div>
            <CardContent className="p-3 sm:p-5">
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <span key={day} className="py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-mute sm:text-xs">{day}</span>)}
                {Array.from({ length: firstDay }, (_, index) => <span key={`empty-${index}`} />)}
                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const past = date < todayStart
                  const daySessions = monthSessions.filter(session => sameDay(session.date, date))
                  return (
                    <button key={day} type="button" disabled={past} onClick={() => openScheduler(date)}
                      aria-label={`${dateLabel(date)}, ${daySessions.length} sessions`} aria-current={sameDay(date, today) ? "date" : undefined}
                      className={`relative flex h-11 sm:h-14 flex-col items-center justify-center gap-1 rounded-xl border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse sm:rounded-2xl ${sameDay(date, today) ? "border-pulse bg-pulse-soft font-bold text-pulse-dark" : daySessions.length ? "border-line bg-surface-sunken font-semibold text-ink" : "border-transparent text-ink-soft hover:border-line hover:bg-surface-sunken"} disabled:cursor-default disabled:text-ink-mute disabled:opacity-40`}>
                      {day}
                      {daySessions.length > 0 && <span className="size-1 rounded-full bg-pulse" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 text-[11px] text-ink-mute sm:px-6">
              <span>Select a date to plan a session.</span>
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-pulse" /> Scheduled session</span>
            </div>
          </Card>

          <aside className="space-y-5">
            <Card>
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="font-display text-base font-bold tracking-tight text-ink">Coming up</h2>
                  <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">{upcoming.length}</span>
                </div>
                {upcoming.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line-strong px-4 py-7 text-center">
                    <span className="mx-auto mb-4 grid size-10 place-items-center rounded-xl bg-surface-sunken text-pulse-dark"><CalendarDays className="size-4" strokeWidth={1.8} /></span>
                    <h3 className="text-sm font-semibold text-ink">Room for your next focus session</h3>
                    <p className="mt-2 text-xs leading-6 text-ink-soft">Pick a day and a partner. Your next session will appear here.</p>
                    <Button variant="ghost" size="sm" onClick={() => openScheduler(today)} className="mt-4 text-pulse-dark">Plan a session <ArrowRight className="size-3.5" /></Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map(session => (
                      <article key={session.id} className="rounded-2xl border border-line bg-surface-sunken p-4">
                        <p className="text-[11px] font-semibold text-pulse-dark">{dateLabel(session.date)} · {session.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
                        <h3 className="mt-2 break-words text-sm font-semibold leading-6 text-ink">{session.topic}</h3>
                        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                          <Avatar name={session.friend.name} size="xs" />
                          <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">{session.friend.name}</span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-ink-mute"><Clock3 className="size-3" />{session.duration}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-sunken p-4">
              <UsersRound className="mt-0.5 size-4 shrink-0 text-pulse-dark" strokeWidth={1.8} />
              <p className="text-xs leading-6 text-ink-soft">A specific topic helps you both arrive ready. Try “Practice recursion” instead of “Computer science”.</p>
            </div>
            <p className="px-2 text-[11px] leading-5 text-ink-mute">Preview mode · sessions are kept for this visit. Invitations and reminders are not connected yet.</p>
          </aside>
        </div>
      </main>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <span className="mb-2 grid size-9 place-items-center rounded-xl border border-line bg-surface text-pulse-dark"><CalendarDays className="size-4" strokeWidth={1.8} /></span>
            <DrawerTitle className="font-display text-xl font-bold tracking-tight text-ink">Plan a focus session</DrawerTitle>
            <DrawerDescription className="text-ink-soft">Choose who to study with and what you want to work on.</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={scheduleSession} className="flex min-h-0 flex-1 flex-col">
            <DrawerBody>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <div className="rounded-xl bg-pulse-soft px-3 py-2 text-center text-pulse-dark">
                <span className="block text-[10px] font-semibold uppercase">{selectedDate.toLocaleDateString("en-US", { month: "short" })}</span>
                <span className="block font-display text-2xl font-bold tabular-nums">{selectedDate.getDate()}</span>
              </div>
              <div><p className="text-xs text-ink-mute">Your selected day</p><p className="mt-1 text-sm font-semibold text-ink">{selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric" })}</p></div>
              <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => setIsOpen(false)}>Change</Button>
            </div>

            <fieldset className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <legend className="px-1 text-xs font-semibold text-ink-soft">Study partner</legend>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-mute" />
                <Input aria-label="Search study partners" placeholder="Find a partner…" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="h-10 pl-9 text-sm" />
              </div>
              <div className="max-h-52 space-y-1 overflow-y-auto">
                {filteredFriends.map(friend => (
                  <button key={friend.id} type="button" aria-pressed={selectedFriend?.id === friend.id} onClick={() => setSelectedFriend(friend)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse ${selectedFriend?.id === friend.id ? "border-pulse/30 bg-pulse-soft" : "border-transparent hover:bg-surface-sunken"}`}>
                    <Avatar name={friend.name} size="sm" status={friend.status} />
                    <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-ink">{friend.name}</span><span className="block text-[11px] capitalize text-ink-mute">{friend.status}</span></span>
                    {selectedFriend?.id === friend.id && <Check className="size-4 text-pulse-dark" />}
                  </button>
                ))}
                {filteredFriends.length === 0 && <p className="py-5 text-center text-xs text-ink-mute">No partners found. Try another name.</p>}
              </div>
            </fieldset>

            <div className="space-y-5 rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <fieldset>
                <legend className="mb-2 text-xs font-medium text-ink-soft">Start time · your local time</legend>
                <TimeInput value={sessionTime} onChange={setSessionTime} className="h-12" />
              </fieldset>
              <div className="space-y-2">
                <Label htmlFor="schedule-duration" className="text-xs text-ink-soft">Duration</Label>
                <CustomSelect id="schedule-duration" value={sessionDuration} onChange={setSessionDuration} options={durations.map(value => ({ value, label: value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-topic" className="text-xs text-ink-soft">What will you work on?</Label>
                <Textarea id="schedule-topic" value={sessionTopic} onChange={event => setSessionTopic(event.target.value)} placeholder="e.g. Practice recursion and solve two problems" rows={3} maxLength={300} required />
              </div>
            </div>
            {error && <p role="alert" className="rounded-xl bg-rose p-3 text-xs leading-5 text-rose-deep">{error}</p>}
            <p className="text-xs leading-5 text-ink-mute">This adds the session to your calendar for this visit. No invitation is sent yet.</p>
            </DrawerBody>
            <DrawerFooter>
              <Button type="submit" variant="accent" disabled={!canSchedule} className="h-10 w-full"><Plus className="size-3.5" /> Schedule session</Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="h-10 w-full">Cancel</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
