import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  /** "light" for use on dark backgrounds */
  tone?: "default" | "light"
  size?: "sm" | "md" | "lg" | "xl"
  /** Show the pulse badge. Off by default — the wordmark is the brand. */
  mark?: boolean
}

const SIZES = {
  sm: "text-[22px]",
  md: "text-[24px]",
  lg: "text-[32px]",
  xl: "text-[42px]",
}

export default function Logo({
  className,
  tone = "default",
  size = "sm",
  mark = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="PeerPulse home"
    >
      {mark && (
        <span
          className={cn(
            "relative grid h-9 w-9 place-items-center rounded-[11px] shadow-soft transition-transform duration-300 group-hover:-rotate-6",
            tone === "light" ? "bg-white" : "bg-ink",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={cn("h-[19px] w-[19px]", tone === "light" ? "text-ink" : "text-white")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12h3.5l2-5 3 11 2.5-7 1.5 3H22" />
          </svg>
        </span>
      )}
      <span
        className={cn(
          "font-brand font-bold leading-none tracking-[-0.04em]",
          SIZES[size],
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        PeerPulse
      </span>
    </Link>
  )
}
