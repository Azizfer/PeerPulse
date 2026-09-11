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
    <Link href={href} className="flex min-h-12 items-center gap-3 bg-surface px-4 hover:bg-surface-sunken transition-colors">
      <div className="size-8 shrink-0 rounded-lg bg-surface-sunken flex items-center justify-center text-ink">
        {icon}
      </div>
      <p className="flex-1 truncate text-sm font-normal text-ink">{label}</p>
    </Link>
  )
}
