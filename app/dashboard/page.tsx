"use client"

import Header from "@/components/Header"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { ArrowRight, TrendingUp } from "lucide-react"
import { SparklesIcon, BookOpenIcon, UsersIcon, CalendarIcon, ClockIcon } from "@/components/custom-icons"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const upcomingSessions = [
    { id: 1, partner: "Alex Chen", subject: "Calculus II", time: "Today, 3:00 PM", avatar: "AC" },
    { id: 2, partner: "Emma Wilson", subject: "Biology", time: "Tomorrow, 10:00 AM", avatar: "EW" },
  ]

  const recentSessions = [
    { id: 1, partner: "Noah Brown", subject: "Physics Problems", duration: "1h 15m", date: "2 hours ago", avatar: "NB" },
    { id: 2, partner: "Sophie Taylor", subject: "Chemistry Review", duration: "45m", date: "Yesterday", avatar: "ST" },
    { id: 3, partner: "Liam Davis", subject: "Math Practice", duration: "1h", date: "2 days ago", avatar: "LD" },
  ]

  const studyPartners = [
    { name: "Alex Chen", sessions: 12, avatar: "AC", status: "online" },
    { name: "Emma Wilson", sessions: 8, avatar: "EW", status: "online" },
    { name: "Noah Brown", sessions: 6, avatar: "NB", status: "offline" },
  ]

  const weeklyStats = {
    totalHours: 8.5,
    sessionsCompleted: 6,
    streak: 4,
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />

        <main className="max-w-[1400px] mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-2" 
              style={{ fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              Welcome back, Sarah
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-700" 
              style={{ fontWeight: 400 }}
            >
              Ready to make today productive?
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                <Link href="/study" className="group">
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[32px] p-8 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <BookOpenIcon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white" style={{ fontWeight: 700 }}>Start Studying</h2>
                      <p className="text-white/80 text-sm mt-2">Find a study partner now</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all self-end" />
                  </div>
                </Link>

                <Link href="/schedule" className="group">
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-pink-500 rounded-[32px] p-8 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <CalendarIcon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white" style={{ fontWeight: 700 }}>Schedule</h2>
                      <p className="text-white/80 text-sm mt-2">View your upcoming sessions</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all self-end" />
                  </div>
                </Link>
              </motion.div>

              {/* Weekly Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[32px] p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#0A0A0A]" style={{ fontWeight: 700 }}>This Week</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-4xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>{weeklyStats.totalHours}h</div>
                    <div className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Study time</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>{weeklyStats.sessionsCompleted}</div>
                    <div className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Sessions</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>{weeklyStats.streak}</div>
                    <div className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Day streak 🔥</div>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Sessions */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-[32px] p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#0A0A0A]" style={{ fontWeight: 700 }}>Upcoming Sessions</h3>
                  <Link href="/schedule" className="text-sm text-[#0A0A0A] hover:text-gray-600 font-medium transition-colors" style={{ fontWeight: 500 }}>
                    View all &gt;
                  </Link>
                </div>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map(session => (
                      <div key={session.id} className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg" style={{ fontWeight: 700 }}>
                          {session.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#0A0A0A] text-lg" style={{ fontWeight: 700 }}>{session.partner}</div>
                          <div className="text-sm text-gray-700 mt-0.5" style={{ fontWeight: 500 }}>{session.subject}</div>
                        </div>
                        <div className="text-sm text-gray-700 flex items-center gap-2 font-medium" style={{ fontWeight: 500 }}>
                          <ClockIcon className="w-4 h-4" />
                          {session.time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-6" style={{ fontSize: '16px' }}>No upcoming sessions</p>
                    <Button asChild className="relative bg-[#0A0A0A] text-white rounded-xl px-6 py-3 font-semibold overflow-hidden group" style={{ fontWeight: 600 }}>
                      <Link href="/schedule" className="inline-flex items-center justify-center">
                        <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                        <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-300">Schedule a Session</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-[32px] p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-[#0A0A0A] mb-6" style={{ fontWeight: 700 }}>Recent Sessions</h3>
                <div className="space-y-3">
                  {recentSessions.map(session => (
                    <div key={session.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ fontWeight: 700 }}>
                        {session.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#0A0A0A]" style={{ fontWeight: 600 }}>{session.partner}</div>
                        <div className="text-sm text-gray-600" style={{ fontWeight: 400 }}>{session.subject}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#0A0A0A]" style={{ fontWeight: 600 }}>{session.duration}</div>
                        <div className="text-xs text-gray-500">{session.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Study Partners */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-[32px] p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#0A0A0A]" style={{ fontWeight: 700 }}>Study Partners</h3>
                  <Link href="/community" className="text-sm text-[#0A0A0A] hover:text-gray-600 font-medium transition-colors" style={{ fontWeight: 500 }}>
                    See all &gt;
                  </Link>
                </div>
                <div className="space-y-4">
                  {studyPartners.map((partner, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold" style={{ fontWeight: 700 }}>
                          {partner.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${partner.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#0A0A0A]" style={{ fontWeight: 600 }}>{partner.name}</div>
                        <div className="text-sm text-gray-600" style={{ fontWeight: 400 }}>{partner.sessions} sessions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-[32px] p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-4" style={{ fontWeight: 700 }}>Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/explore" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-[#0A0A0A] font-semibold flex-1" style={{ fontWeight: 600 }}>Explore Groups</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link href="/community" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-pink-500" />
                    </div>
                    <span className="text-[#0A0A0A] font-semibold flex-1" style={{ fontWeight: 600 }}>My Community</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

