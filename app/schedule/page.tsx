"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Avatar } from "@/components/avatar"
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ClockIcon } from "@/components/custom-icons"
import { CustomSelect } from "@/components/ui/custom-select"
import { TimeInput } from "@/components/ui/time-input"

interface Friend {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
}

interface Session {
  id: string
  date: Date
  time: string
  duration: string
  topic: string
  friend: Friend
}

const mockFriends: Friend[] = [
  { id: "1", name: "Alex Chen", avatar: "AC", status: "online" },
  { id: "2", name: "Emma Wilson", avatar: "EW", status: "online" },
  { id: "3", name: "Noah Brown", avatar: "NB", status: "offline" },
  { id: "4", name: "Sophie Taylor", avatar: "ST", status: "online" },
  { id: "5", name: "Liam Davis", avatar: "LD", status: "offline" },
]

const mockSessions: Session[] = [
  {
    id: "1",
    date: new Date(2025, 9, 25, 14, 0),
    time: "2:00 PM",
    duration: "1 hour",
    topic: "Calculus Study Session",
    friend: mockFriends[0],
  },
  {
    id: "2",
    date: new Date(2025, 9, 27, 10, 0),
    time: "10:00 AM",
    duration: "45 min",
    topic: "Biology Review",
    friend: mockFriends[1],
  },
]

// Duration options for the picker
const durationOptions = [
  { value: "30 min", label: "30 minutes" },
  { value: "45 min", label: "45 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "1.5 hours", label: "1.5 hours" },
  { value: "2 hours", label: "2 hours" },
  { value: "2.5 hours", label: "2.5 hours" },
  { value: "3 hours", label: "3 hours" },
]

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [sessionTime, setSessionTime] = useState("")
  const [sessionDuration, setSessionDuration] = useState("1 hour")
  const [sessionTopic, setSessionTopic] = useState("")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const hasSession = (day: number) => {
    return sessions.some(session => {
      return (
        session.date.getDate() === day &&
        session.date.getMonth() === currentDate.getMonth() &&
        session.date.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const handleDayClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(selected)
    setIsModalOpen(true)
  }

  const handleCreateSession = () => {
    if (!selectedDate || !selectedFriend || !sessionTime || !sessionTopic) {
      alert("Please fill in all fields")
      return
    }

    const newSession: Session = {
      id: Math.random().toString(),
      date: selectedDate,
      time: sessionTime,
      duration: sessionDuration,
      topic: sessionTopic,
      friend: selectedFriend,
    }

    setSessions([...sessions, newSession])
    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedFriend(null)
    setSessionTime("")
    setSessionDuration("1 hour")
    setSessionTopic("")
  }

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const upcomingSessions = sessions
    .filter(session => session.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <>
      <div className="min-h-screen bg-paper">
        <Header />

        <main className="container-page max-w-6xl py-10 sm:py-14">
          <div className="mb-10">
            <span className="eyebrow">Plan ahead</span>
            <h1 className="mt-3 font-display text-h2 font-extrabold text-ink">Schedule</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              Book a focus session with a peer, or claim a slot for yourself first.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-ink">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={previousMonth}
                      className="rounded-full p-2 text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="rounded-full p-2 text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const today = isToday(day)
                    const hasSessionDay = hasSession(day)

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`
                          relative aspect-square rounded-xl p-1 text-center text-sm
                          transition-all duration-150 hover:-translate-y-0.5
                          ${today ? "bg-ink font-bold text-white shadow-soft" : "text-ink-soft hover:bg-surface-sunken hover:text-ink"}
                          ${hasSessionDay && !today ? "bg-pulse-soft font-semibold text-pulse-dark hover:bg-pulse-soft" : ""}
                        `}
                      >
                        <span>{day}</span>
                        {hasSessionDay && (
                          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pulse" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-8 rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <h3 className="font-display text-[18px] font-extrabold tracking-[-0.025em] text-ink">Upcoming sessions</h3>
                
                <div className="space-y-4">
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken">
                        <CalendarIcon className="w-6 h-6 text-ink-faint" />
                      </div>
                      <p className="font-display text-[15px] font-bold text-ink">No sessions scheduled</p>
                      <p className="mt-1 text-sm text-ink-faint">Click a date to create one</p>
                    </div>
                  ) : (
                    upcomingSessions.map(session => (
                      <div
                        key={session.id}
                        className="rounded-2xl border border-line bg-surface-sunken/60 p-4 transition-colors hover:border-pulse/40 hover:bg-pulse-soft/40"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={session.friend.name} size="sm" status={session.friend.status} />
                            <div>
                              <div className="font-semibold text-ink">{session.friend.name}</div>
                              <div className="text-xs text-ink-soft">{session.time}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 text-sm font-medium text-ink">{session.topic}</div>
                        <div className="flex items-center gap-3 text-xs text-ink-mute">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {session.date.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {session.duration}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-line bg-surface p-7 shadow-lift sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-[26px] font-extrabold tracking-[-0.03em] text-ink">Schedule session</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full p-2 text-ink-mute transition-colors hover:bg-surface-sunken hover:text-ink"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl bg-pulse-soft/60 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-pulse-dark">Selected date</div>
                    <div className="mt-1 font-display text-[18px] font-bold text-ink">
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-ink">
                      Select friend
                    </label>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint" />
                      <Input
                        type="text"
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 rounded-xl border-line pl-10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                      {filteredFriends.map(friend => (
                        <button
                          key={friend.id}
                          onClick={() => setSelectedFriend(friend)}
                          className={`
                            rounded-2xl border p-4 text-left transition-all duration-150
                            ${selectedFriend?.id === friend.id
                              ? "border-pulse bg-pulse-soft/50 shadow-soft"
                              : "border-line hover:border-ink-faint hover:bg-surface-sunken/50"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar name={friend.name} size="sm" status={friend.status} />
                            <div>
                              <div className="font-semibold text-ink">{friend.name}</div>
                              <div className="flex items-center gap-1 text-xs capitalize text-ink-mute">
                                {friend.status}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-ink">
                        Time
                      </label>
                      <TimeInput
                        value={sessionTime}
                        onChange={setSessionTime}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-ink">
                        Duration
                      </label>
                      <div className="h-12">
                        <CustomSelect
                          value={sessionDuration}
                          onChange={setSessionDuration}
                          options={durationOptions}
                          placeholder="Select duration"
                          className="h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-ink">
                      Session topic
                    </label>
                    <Textarea
                      placeholder="What will you be studying?"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      className="min-h-24 rounded-xl border-line"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" size="lg" className="flex-1" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="accent" size="lg" className="flex-1" onClick={handleCreateSession}>
                      Schedule session
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
