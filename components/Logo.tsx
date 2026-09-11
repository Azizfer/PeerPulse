"use client"

import Link from "next/link"
import { Fraunces } from "next/font/google"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal"],
})

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  tone?: "dark" | "light"
}

export default function Logo({ className, size = "md", tone = "dark" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const toneClasses = {
    dark: "text-[#111518]",
    light: "text-white",
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${toneClasses[tone]} ${className ?? ""}`}
    >
      <h2
        className={`${fraunces.className} font-bold tracking-[-0.01em] ${sizeClasses[size]}`}
      >
        PeerPulse
      </h2>
    </Link>
  )
}