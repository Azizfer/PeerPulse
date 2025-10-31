"use client"

import { useEffect } from "react"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SetupCompletePage() {
  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = "/dashboard"
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4 py-12 font-[Lexend,_'Noto_Sans',_sans-serif]">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="h-2 w-12 rounded-full bg-green-600 transition-all"
                />
              ))}
            </div>
            <p className="text-sm text-green-600 font-medium">Setup Complete!</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-white border-2 border-gray-300 p-8 shadow-lg text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-3"
            >
              Welcome to PeerPulse!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-gray-600 mb-6"
            >
              Your profile is ready. Let's start your study journey!
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3 text-left bg-blue-50 rounded-lg p-4 mb-6"
            >
              <p className="text-sm text-blue-900 font-medium mb-2">What's Next?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Find study partners with similar goals</li>
                <li>• Join study communities</li>
                <li>• Track your study progress</li>
                <li>• Connect with fellow students</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Link href="/dashboard">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                  Go to Dashboard
                </Button>
              </Link>

              <p className="text-xs text-gray-500 mt-4">
                Redirecting automatically in a few seconds...
              </p>
            </motion.div>
          </motion.div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              You can customize your preferences anytime in{" "}
              <Link href="/settings" className="text-blue-600 hover:text-blue-500 font-medium">
                Settings
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
