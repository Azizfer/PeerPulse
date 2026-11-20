"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function HeaderDropdown({ title, icon: Icon, unreadCount, children, footer }: {
  title: string
  icon: LucideIcon
  unreadCount: number
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative rounded-xl data-[state=open]:bg-surface-sunken" aria-label={`${title}, ${unreadCount} unread`}>
          <Icon className="size-4 text-ink-soft" strokeWidth={1.8} />
          {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-deep px-1 text-[9px] font-bold leading-none text-white ring-2 ring-paper" aria-hidden="true">{unreadCount > 9 ? "9+" : unreadCount}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} collisionPadding={12} aria-label={title}
        className="flex max-h-[min(520px,var(--radix-dropdown-menu-content-available-height))] w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border-line bg-surface p-0 text-ink shadow-card">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-4">
          <h2 className="font-display text-sm font-bold text-ink">{title}</h2>
          <span className="text-[11px] text-ink-mute">{unreadCount ? `${unreadCount} unread` : "All caught up"}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5">{children}</div>
        <div className="shrink-0 border-t border-line p-2">{footer}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
