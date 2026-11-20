import { cn } from "@/lib/utils"

export function PeerPulseMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-gradient-to-br from-[#6975dc] via-[#5e6ad2] to-[#3d9e91] text-white shadow-[0_8px_22px_-12px_rgba(94,106,210,0.9)]",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.32),transparent_42%)]" />
      <svg viewBox="0 0 28 28" className="relative size-[21px]" fill="none">
        <circle cx="4.5" cy="14" r="2.1" fill="currentColor" />
        <circle cx="23.5" cy="14" r="2.1" fill="currentColor" />
        <path
          d="M7 14h3l2-5 3.4 10 2.7-7 1.6 2H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
