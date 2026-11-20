import type { ReactNode } from "react"
import Link from "next/link"

export default function MenuItem({
  icon,
  label,
  href = "#",
}: {
  icon: ReactNode
  label: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center gap-3 px-4 transition-colors hover:bg-surface-sunken"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-sunken text-ink-soft">
        {icon}
      </span>
      <span className="flex-1 truncate text-sm text-ink">{label}</span>
    </Link>
  )
}
