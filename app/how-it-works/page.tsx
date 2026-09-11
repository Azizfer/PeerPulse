"use client"

import Link from "next/link"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowRight, ChevronDown, Zap, Search, Timer, Video, VideoOff } from "lucide-react"

const PAPER = "#F3F4F6"
const INK = "#12151C"
const TEAL = "#20C4B0"
const SLATE = "#3F6F7A"
const CARD = "#E7E9ED"

const steps = [
  {
    title: "Click \"Get Paired\"",
    description:
      "When you're ready to study, hit the button on your dashboard. We start looking for another student online right now, studying something close to what you're working on.",
    icon: Zap,
    visual: "start",
  },
  {
    title: "Get matched in seconds",
    description:
      "Matching runs on subject, university, and study level. Most pairings land in under a minute — you'll see who you've been paired with before you even finish getting comfortable.",
    icon: Search,
    visual: "match",
  },
  {
    title: "Land in a shared session",
    description:
      "You and your partner drop straight into a room with a synced Pomodoro timer, chat, and video — already running, nothing to configure.",
    icon: Timer,
    visual: "timer",
  },
  {
    title: "Study, your way",
    description:
      "Camera on, camera off, voice only, or just text — toggle anything mid-session without breaking your partner's focus. Work the problems, compare notes, keep each other honest.",
    icon: Video,
    visual: "camera",
  },
]

const faqs = [
  {
    question: "How long does it take to get paired?",
    answer: "Most pairings happen within 30 seconds. Our system looks for online students studying similar subjects right now.",
  },
  {
    question: "Do I need to turn on my camera?",
    answer: "No, camera use is entirely optional. You can study on video, voice only, or text chat depending on what you're in the mood for.",
  },
  {
    question: "Can I schedule sessions in advance?",
    answer: "Yes. Once you've studied with someone a few times, you can set up a standing session at a time that works for both of you instead of relying on the queue.",
  },
  {
    question: "What if my match isn't a good fit?",
    answer: "You can end a session at any time, no explanation needed. It won't affect how you're matched going forward.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPER }}>
      <Header />

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 md:pt-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1
            className="text-4xl md:text-5xl mb-6 leading-tight"
            style={{ fontFamily: "var(--font-lexend)", fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}
          >
            From "I should study" to studying, in four steps.
          </h1>
          <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: "#4A5568" }}>
            No scheduling, no waiting on friends to be free. Open the app, get paired,
            and someone's working alongside you within a minute.
          </p>
          <Button asChild className="h-[52px] px-7 text-base rounded-xl relative overflow-hidden group" style={{ backgroundColor: INK, color: PAPER, fontWeight: 600 }}>
            <Link href="/signup" className="relative inline-flex items-center gap-2">
              <span className="absolute inset-0 rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" style={{ backgroundColor: TEAL }} />
              <span className="relative z-10 group-hover:text-[#12151C] transition-colors duration-300">Get started</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:text-[#12151C] transition-colors duration-300" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Steps timeline */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto relative">
          {/* Connecting line — the one signature animation on this page: the path drawing itself in */}
          <motion.div
            className="absolute left-[27px] top-3 bottom-3 w-0.5 origin-top"
            style={{ backgroundColor: "#D6DBE0" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="relative flex gap-6"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: INK }}
                  >
                    <Icon className="w-6 h-6" style={{ color: TEAL }} />
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium mb-1" style={{ color: SLATE }}>Step {index + 1}</p>
                    <h3
                      className="text-xl md:text-2xl mb-2"
                      style={{ fontFamily: "var(--font-lexend)", fontWeight: 600, color: INK }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed mb-5 max-w-lg" style={{ color: "#4A5568" }}>
                      {step.description}
                    </p>

                    <StepVisual variant={step.visual} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24" style={{ backgroundColor: INK }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl mb-12 text-center"
            style={{ fontFamily: "var(--font-lexend)", fontWeight: 600, color: PAPER }}
          >
            Questions people actually ask
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ backgroundColor: INK, borderTop: "1px solid #2A2F3A" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm" style={{ color: "#8A93A0" }}>
            © {new Date().getFullYear()} PeerPulse. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/terms" className="text-sm hover:text-white transition-colors" style={{ color: "#9AA5B1" }}>Terms</Link>
            <Link href="/privacy" className="text-sm hover:text-white transition-colors" style={{ color: "#9AA5B1" }}>Privacy</Link>
            <Link href="/contact" className="text-sm hover:text-white transition-colors" style={{ color: "#9AA5B1" }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepVisual({ variant }: { variant: string }) {
  if (variant === "start") {
    return (
      <div className="rounded-2xl p-5 inline-flex items-center gap-3" style={{ backgroundColor: CARD }}>
        <div className="relative flex items-center justify-center">
          <motion.span
            className="absolute rounded-full"
            style={{ width: 44, height: 44, backgroundColor: TEAL, opacity: 0.3 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="px-5 py-2.5 rounded-lg relative text-sm font-semibold" style={{ backgroundColor: INK, color: PAPER }}>
            Get Paired
          </div>
        </div>
      </div>
    )
  }

  if (variant === "match") {
    return (
      <div className="rounded-2xl p-4 inline-flex items-center gap-3" style={{ backgroundColor: CARD }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: SLATE }}>
          A
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: INK }}>Matched with Alex</p>
          <p className="text-xs text-gray-500">Computer Science · Studying Data Structures</p>
        </div>
      </div>
    )
  }

  if (variant === "timer") {
    return (
      <div className="rounded-2xl p-4 inline-flex items-center gap-4" style={{ backgroundColor: CARD }}>
        <span className="text-2xl font-bold tabular-nums" style={{ color: INK }}>25:00</span>
        <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#D6DBE0" }}>
          <div className="h-1.5 rounded-full w-[10%]" style={{ backgroundColor: TEAL }} />
        </div>
        <span className="text-xs" style={{ color: SLATE }}>Just started</span>
      </div>
    )
  }

  // camera
  return (
    <div className="rounded-2xl p-3 inline-flex items-center gap-2" style={{ backgroundColor: CARD }}>
      <div className="w-16 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#D6DBE0" }}>
        <Video className="w-4 h-4" style={{ color: SLATE }} />
      </div>
      <div className="w-16 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#D6DBE0" }}>
        <VideoOff className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1B1F27" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-medium text-white">{question}</span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
          style={{ color: TEAL, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#9AA5B1" }}>
          {answer}
        </p>
      </motion.div>
    </div>
  )
}