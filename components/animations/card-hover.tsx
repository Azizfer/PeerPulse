"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverScale?: number
  tapScale?: number
}

export function AnimatedCard({ 
  children, 
  className = "",
  hoverScale = 1.02,
  tapScale = 0.98 
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale: hoverScale,
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: tapScale }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {children}
    </motion.div>
  )
}

export function PulseCard({ 
  children, 
  className = "",
  pulseScale = 1.05 
}: AnimatedCardProps & { pulseScale?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, pulseScale, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
