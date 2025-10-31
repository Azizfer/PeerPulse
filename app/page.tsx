"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { useAuth } from "@/components/auth-provider"
import DashboardPage from "./dashboard/page"
import { motion } from "framer-motion"
import { useState } from "react"
import Header from "@/components/Header"

export default function Home() {
  const { isLoggedIn } = useAuth()

  // If user is logged in, show dashboard
  if (isLoggedIn) {
    return <DashboardPage />
  }

  // Otherwise show PeerPulse landing page
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-white overflow-x-hidden">
        {/* Decorative Background Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-12 w-16 h-16 rounded-full bg-[#F5A962] opacity-80"></div>
          <div className="absolute top-20 right-16 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-[#F5A962] opacity-70"></div>
          <div className="absolute top-[40%] right-[8%] w-24 h-24 rounded-full bg-[#A8D5E2] opacity-70"></div>
          <div className="absolute top-[45%] left-[5%] w-32 h-32 bg-[#A8D5E2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"></div>
          <div className="absolute bottom-[30%] right-[15%] w-28 h-28 bg-[#C4B5FD] opacity-60 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"></div>
        </div>

        {/* ---------- HEADER ---------- */}
        <Header />

        {/* ---------- HERO ---------- */}
        <section className="relative z-10 px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-[#0A0A0A] mb-5 leading-tight" style={{ fontWeight: 700 }}
            >
              The all-in-one for students who study together
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-base md:text-lg text-gray-700 mb-8 max-w-xl mx-auto" style={{ fontWeight: 400 }}
            >
              Join 1,000+ students who use PeerPulse to run their study sessions, connect with peers, and ace their exams.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <Button asChild className="relative bg-[#0A0A0A] text-white rounded-xl px-7 py-3.5 text-base font-semibold h-auto shadow-sm overflow-hidden group transition-all duration-300" style={{ fontWeight: 600, height: '52px' }}>
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 relative">
                  <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0A0A0A] group-hover:-translate-y-0.5 transition-all duration-300">
                    Start your free trial
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">&gt;</span>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ---------- FEATURES ---------- */}
        <section id="features" className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {/* Feature Card 1 - Instant Matching */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 80 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="group transform md:-rotate-2 transition-all duration-500 ease-out hover:rotate-0 hover:scale-105 hover:-translate-y-2 relative overflow-hidden rounded-[32px] shadow-xl hover:shadow-2xl"
            >
              {/* Base card */}
              <div className="bg-[#A8D5E2] rounded-[32px] p-8 shadow-lg transition-all duration-500">
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-3 transition-colors duration-500 group-hover:text-white relative z-10" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Instant Matching ›
                </h3>
                <p className="text-base text-gray-800 mb-6 leading-relaxed transition-colors duration-500 group-hover:text-gray-100 relative z-10" style={{ fontWeight: 400, lineHeight: '1.6' }}>
                  Get paired with compatible study partners in seconds based on subject, goals, and availability.
                </p>
                <div className="bg-white/40 rounded-2xl p-4 backdrop-blur-sm relative z-10 transition-all duration-500 group-hover:bg-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 transition-colors duration-500 group-hover:text-white">Alex</p>
                      <p className="text-sm text-gray-700 transition-colors duration-500 group-hover:text-gray-200">Calculus II</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700 transition-colors duration-500 group-hover:text-gray-200">Available now</span>
                  </div>
                </div>
              </div>
              {/* Dark overlay that slides up on hover */}
              <div className="absolute inset-0 bg-[#10242F] rounded-[32px] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </motion.div>

            {/* Feature Card 2 - Pomodoro Timer */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 80 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="group transform md:rotate-1 transition-all duration-500 ease-out hover:rotate-0 hover:scale-105 hover:-translate-y-2 relative overflow-hidden rounded-[32px] shadow-xl hover:shadow-2xl"
            >
              <div className="bg-[#F5A962] rounded-[32px] p-8 shadow-lg transition-all duration-500">
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-3 transition-colors duration-500 group-hover:text-[#F6DDC4] relative z-10" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Pomodoro Timer ›
                </h3>
                <p className="text-base text-gray-800 mb-6 leading-relaxed transition-colors duration-500 group-hover:text-[#F6DDC4] relative z-10" style={{ fontWeight: 400, lineHeight: '1.6' }}>
                  Stay focused with built-in 25-minute work sessions. Proven technique to boost productivity and retention.
                </p>
                <div className="bg-white/40 rounded-2xl p-4 backdrop-blur-sm relative z-10 transition-all duration-500 group-hover:bg-white/20">
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2 transition-colors duration-500 group-hover:text-[#F6DDC4]">25:00</div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300 transition-colors duration-500 group-hover:bg-gray-600"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300 transition-colors duration-500 group-hover:bg-gray-600"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300 transition-colors duration-500 group-hover:bg-gray-600"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dark overlay that slides up on hover */}
              <div className="absolute inset-0 bg-[#452623] rounded-[32px] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </motion.div>

            {/* Feature Card 3 - Video & Voice Chat */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 80 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="group transform md:-rotate-1 transition-all duration-500 ease-out hover:rotate-0 hover:scale-105 hover:-translate-y-2 relative overflow-hidden rounded-[32px] shadow-xl hover:shadow-2xl"
            >
              <div className="bg-[#C4B5FD] rounded-[32px] p-8 shadow-lg transition-all duration-500">
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-3 transition-colors duration-500 group-hover:text-[#E5D7F5] relative z-10" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Video & Voice Chat ›
                </h3>
                <p className="text-base text-gray-800 mb-6 leading-relaxed transition-colors duration-500 group-hover:text-[#E5D7F5] relative z-10" style={{ fontWeight: 400, lineHeight: '1.6' }}>
                  Collaborate seamlessly with HD video calls, voice chat, or messaging. Choose what works best.
                </p>
                <div className="bg-white/40 rounded-2xl p-4 backdrop-blur-sm relative z-10 transition-all duration-500 group-hover:bg-white/20">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-900 rounded-xl h-20 transition-colors duration-500 group-hover:bg-gray-700"></div>
                    <div className="bg-gray-700 rounded-xl h-20 transition-colors duration-500 group-hover:bg-gray-600"></div>
                  </div>
                  <div className="flex justify-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-colors duration-500 group-hover:bg-gray-700">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0 64 64 0 0 0 128 0 8 8 0 0 1 16 0 80.11 80.11 0 0 1-72 79.6Z" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-colors duration-500 group-hover:bg-gray-700">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M251.77 73a8 8 0 0 0-8.21.39L208 97.05V72a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-25.05l35.56 23.66A8 8 0 0 0 256 176V80a8 8 0 0 0-4.23-7ZM192 184H32V72h160v112Zm48-22.95-32-21.33v-23.44L240 95v66.05Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dark overlay that slides up on hover */}
              <div className="absolute inset-0 bg-[#1F1738] rounded-[32px] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </motion.div>
          </motion.div>
        </section>

        {/* ---------- TESTIMONIAL ---------- */}
        <section className="relative z-10 px-6 py-20 bg-white overflow-hidden">
          {/* White arc overlay that hides bottom of cards */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-white" style={{
            borderRadius: '0 0 50% 50%',
            transform: 'translateY(-50%) scaleX(2)',
            transformOrigin: 'top center',
            zIndex: 5
          }}></div>
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4" style={{ fontWeight: 700 }}
            >
              Their studying finally found an all-in-one home with PeerPulse. So can yours.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-gray-700 mb-16 max-w-3xl mx-auto"
            >
              More than 1,000 students — including pre-med, engineering, business, and many more — ace their exams with PeerPulse.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-600">Biology Major</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed text-left">
                  "PeerPulse helped me stay focused and motivated. Finding study partners is instant!"
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-3xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Marcus L.</p>
                    <p className="text-sm text-gray-600">Computer Science</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed text-left">
                  "Now I have accountability partners and we push each other. My grades improved significantly!"
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-3xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Emma K.</p>
                    <p className="text-sm text-gray-600">Engineering</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed text-left">
                  "The video chat and whiteboard features make studying complex problems so much easier!"
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURE DETAILS ---------- */}
        <section className="relative z-10 px-5 md:px-8 lg:px-16 py-20 bg-white">
          {/* Community Feature */}
          <div className="max-w-6xl mx-auto mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-[#F5A962] rounded-3xl p-8 md:p-12 relative overflow-hidden min-h-[400px] flex items-center justify-center"
              >
                <div className="absolute top-8 left-8 w-12 h-12 bg-gray-900 rounded-full opacity-80"></div>
                <div className="absolute bottom-12 right-8 w-16 h-16 bg-white/50 rounded-full"></div>
                <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      SC
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Study Circle</p>
                      <p className="text-sm text-gray-600">24 members</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded-lg p-2 text-sm">Next session: Today 3 PM</div>
                    <div className="bg-gray-100 rounded-lg p-2 text-sm">Topic: Calculus Review</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-sm font-semibold text-[#0A0A0A] uppercase mb-2" style={{ fontWeight: 600, fontSize: '14px', lineHeight: '1.4', letterSpacing: '0.08em' }}>COMMUNITY</p>
                <h3 className="text-[32px] font-bold text-[#0A0A0A] mb-4" style={{ fontWeight: 700, lineHeight: '1.2', letterSpacing: '-0.01em' }}>
                  Join study communities
                </h3>
                <p className="text-lg text-[#3B3B3B] mb-6" style={{ fontWeight: 400, fontSize: '18px', lineHeight: '1.6' }}>
                  Connect with students in your courses. Join premium study groups, share resources, and collaborate on difficult topics. Build a network of peers who motivate you.
                </p>
                <Button asChild className="relative bg-[#4C2A1E] text-white rounded-[10px] px-6 py-3 text-base font-semibold h-auto overflow-hidden group transition-all duration-250" style={{ fontWeight: 600, fontSize: '16px', lineHeight: '1.25' }}>
                  <Link href="/community" className="inline-flex items-center justify-center gap-1.5 relative">
                    <span className="absolute inset-0 bg-white rounded-[10px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-250 ease-out"></span>
                    <span className="relative z-10 flex items-center gap-1.5 group-hover:text-[#4C2A1E] transition-all duration-250">
                      Explore communities
                      <span className="inline-block transition-transform duration-250 group-hover:translate-x-0.5">&gt;</span>
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Schedule Feature */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-2 md:order-1"
              >
                <p className="text-sm font-semibold text-[#0A0A0A] uppercase mb-2" style={{ fontWeight: 600, fontSize: '14px', lineHeight: '1.4', letterSpacing: '0.08em' }}>SCHEDULING</p>
                <h3 className="text-[32px] font-bold text-[#0A0A0A] mb-4" style={{ fontWeight: 700, lineHeight: '1.2', letterSpacing: '-0.01em' }}>
                  Plan your study sessions
                </h3>
                <p className="text-lg text-[#3B3B3B] mb-6" style={{ fontWeight: 400, fontSize: '18px', lineHeight: '1.6' }}>
                  Schedule study sessions with your favorite partners. Set recurring meetings, sync with your calendar, and never miss a session. PeerPulse keeps you organized and accountable.
                </p>
                <Button asChild className="relative bg-[#1E1134] text-[#C3A5E7] rounded-[10px] px-6 py-3 text-base font-semibold h-auto overflow-hidden group transition-all duration-250" style={{ fontWeight: 600, fontSize: '16px', lineHeight: '1.25' }}>
                  <Link href="/schedule" className="inline-flex items-center justify-center gap-1.5 relative">
                    <span className="absolute inset-0 bg-[#2B184A] rounded-[10px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-250 ease-out"></span>
                    <span className="relative z-10 flex items-center gap-1.5 transition-all duration-250">
                      Learn more
                      <span className="inline-block transition-transform duration-250 group-hover:translate-x-0.5">&gt;</span>
                    </span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-[#A8D5E2] rounded-3xl p-8 md:p-12 relative overflow-hidden min-h-[400px] flex items-center justify-center order-1 md:order-2"
              >
                <div className="absolute top-12 right-8 w-20 h-20 bg-gray-900 opacity-70 rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"></div>
                <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">Today's Sessions</h4>
                    <span className="text-2xl font-bold text-gray-900">3</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Biology - 10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Math - 2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium">Physics - 6:00 PM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------- CTA SECTION ---------- */}
        <section className="relative z-10 bg-[#A8D5E2] py-20 px-6 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-12 left-12 w-16 h-16 bg-white/40 rounded-full"></div>
          <div className="absolute top-8 right-16 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[45px] border-b-gray-900 opacity-80"></div>
          <div className="absolute bottom-12 left-[15%] w-12 h-12 bg-gray-900 opacity-60 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"></div>
          <div className="absolute bottom-8 right-[10%] w-20 h-20 bg-white/30 rounded-full"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto relative z-10"
          >
            <div className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Studying is much simpler when everything is in one place
              </h2>
              <p className="text-base text-gray-700 mb-8">
                See for yourself. Try PeerPulse free for 30 days.
              </p>
              <Button asChild className="relative bg-[#0A0A0A] text-white rounded-xl px-7 py-3.5 text-base font-semibold h-auto shadow-lg overflow-hidden group transition-all duration-300" style={{ fontWeight: 600, height: '52px' }}>
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 relative">
                  <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0A0A0A] group-hover:-translate-y-0.5 transition-all duration-300">
                    Get started
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">&gt;</span>
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* ---------- FOOTER ---------- */}
        <footer className="relative z-10 bg-[#A8D5E2] pt-20 pb-12 px-6 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-16 left-12 w-20 h-20 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-12 left-[15%] w-16 h-16 bg-[#0A0A0A] opacity-70 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"></div>
          <div className="absolute top-20 right-[20%] w-24 h-24 bg-white/20 rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"></div>
          <div className="absolute bottom-16 right-12 w-20 h-20 bg-[#0A0A0A] opacity-60 rounded-full"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              {/* Logo */}
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="text-2xl font-extrabold text-[#0A0A0A] tracking-[-0.03em]" style={{ fontWeight: 800 }}>
                  PeerPulse
                </Link>
              </div>

              {/* Platform */}
              <div>
                <h4 className="font-semibold text-[#0A0A0A] text-sm mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>Platform</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/study" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Study sessions</Link></li>
                  <li><Link href="/community" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Communities</Link></li>
                  <li><Link href="/schedule" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Scheduling</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Pricing</Link></li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-[#0A0A0A] text-sm mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>Features</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/features#matching" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Instant matching</Link></li>
                  <li><Link href="/features#pomodoro" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Pomodoro timer</Link></li>
                  <li><Link href="/features#video" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Video chat</Link></li>
                  <li><Link href="/features#whiteboard" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Whiteboard</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-[#0A0A0A] text-sm mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>Resources</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/how-it-works" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">How it works</Link></li>
                  <li><Link href="/explore" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Explore</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Contact</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold text-[#0A0A0A] text-sm mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>Support</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/contact" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Contact us</Link></li>
                  <li><Link href="/help" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Help center</Link></li>
                  <li><Link href="/terms" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Terms</Link></li>
                  <li><Link href="/privacy" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">Privacy</Link></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-[#0A0A0A]/10">
              <p className="text-sm text-gray-800 text-center md:text-left font-medium">
                © {new Date().getFullYear()} PeerPulse. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
