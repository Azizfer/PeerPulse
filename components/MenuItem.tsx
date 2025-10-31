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
    <Link href={href} className="flex min-h-12 items-center gap-3 bg-[#fdfcfa] px-4 hover:bg-gray-100 transition-colors">
      <div className="size-8 shrink-0 rounded-lg bg-[#f0f3f4] flex items-center justify-center text-[#111518]">
        {icon}
      </div>
      <p className="flex-1 truncate text-sm font-normal text-[#111518]">{label}</p>
    </Link>
  )
}
