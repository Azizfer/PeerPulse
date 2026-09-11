"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import OnboardingLayout from "@/components/OnboardingLayout"
import { Button } from "@/components/ui/button"

export default function SetupCompletePage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/dashboard"
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <OnboardingLayout
      step={3}
      complete
      title="You're all set."
      subtitle="Three people in your subjects are in a focus room right now."
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-2xl bg-pulse-soft p-5"
      >
        <p className="font-display text-[14px] font-bold text-pulse-dark">What happens next</p>
        <ul className="mt-3 space-y-2">
          {[
            "Get matched with peers on your exact subjects",
            "Join a 25-minute focus room whenever you sit down",
            "Ask your community when you get stuck",
          ].map((line) => (
            <li key={line} className="flex gap-2.5 text-[14px] text-pulse-dark/85">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pulse-dark/50" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <Button asChild size="lg" className="w-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <p className="mt-4 text-center text-[12.5px] text-ink-mute">
          Taking you there automatically in a few seconds…
        </p>
      </motion.div>

      <p className="mt-6 text-center text-[13.5px] text-ink-soft">
        You can change any of this later in{" "}
        <Link href="/settings" className="font-medium text-ink underline-offset-4 hover:underline">
          Settings
        </Link>
      </p>
    </OnboardingLayout>
  )
}
