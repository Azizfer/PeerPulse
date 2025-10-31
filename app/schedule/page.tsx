"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { PageTransition } from "@/components/page-transition"
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
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />

        <main className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Schedule</h1>
            <p className="text-xl text-gray-600">Plan your study sessions with friends</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={previousMonth}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1.5">
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
                          aspect-square rounded-lg p-1 text-sm text-center relative
                          transition-all hover:scale-105
                          ${today ? "bg-[#2a2622] text-white font-bold" : "hover:bg-gray-100"}
                          ${hasSessionDay && !today ? "bg-[#e8dcc8] font-semibold" : ""}
                        `}
                      >
                        <span>{day}</span>
                        {hasSessionDay && (
                          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-300 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Sessions</h3>
                
                <div className="space-y-4">
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No sessions scheduled</p>
                      <p className="text-sm text-gray-400 mt-1">Click a date to create one</p>
                    </div>
                  ) : (
                    upcomingSessions.map(session => (
                      <div
                        key={session.id}
                        className="p-4 bg-[#f5f1e8] rounded-xl hover:bg-[#e8dcc8] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[#2a2622] text-white flex items-center justify-center text-sm font-bold">
                              {session.friend.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{session.friend.name}</div>
                              <div className="text-xs text-gray-600">{session.time}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mb-1">{session.topic}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
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
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl p-8 z-50 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Schedule Session</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-[#f5f1e8] rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Selected Date</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Friend
                    </label>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-2 border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                      {filteredFriends.map(friend => (
                        <button
                          key={friend.id}
                          onClick={() => setSelectedFriend(friend)}
                          className={`
                            p-4 rounded-xl border-2 transition-all text-left
                            ${selectedFriend?.id === friend.id
                              ? "border-[#2a2622] bg-[#f5f1e8]"
                              : "border-gray-300 hover:border-gray-400"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#2a2622] text-white flex items-center justify-center font-bold">
                              {friend.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{friend.name}</div>
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${friend.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
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
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Time
                      </label>
                      <TimeInput
                        value={sessionTime}
                        onChange={setSessionTime}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
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
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Session Topic
                    </label>
                    <Textarea
                      placeholder="What will you be studying?"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      className="min-h-24 rounded-xl border-2 border-gray-300"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-12 rounded-xl bg-gray-200 text-gray-900 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateSession}
                      className="flex-1 h-12 rounded-xl bg-[#2a2622] text-white hover:bg-[#1a1612]"
                    >
                      Schedule Session
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
