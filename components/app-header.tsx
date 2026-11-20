"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import MessagesDropdown from "@/components/messages-dropdown"
import NotificationDropdown from "@/components/notification-dropdown"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/study": "Study room",
  "/study/solo": "Solo Pomodoro",
  "/study/groups": "Group sessions",
  "/schedule": "Schedule",
  "/community": "Community",
  "/communities": "Communities",
  "/explore": "Resources",
  "/messages": "Messages",
  "/profile": "Profile",
  "/settings": "Settings",
}

export function AppHeader() {
  const pathname = usePathname()
  const basePath = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
  const title = basePath ? PAGE_TITLES[basePath] : "PeerPulse"

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between rounded-t-[inherit] border-b border-line bg-paper/95 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="size-8 rounded-lg text-ink-mute hover:bg-surface-sunken hover:text-ink" />
        <div className="h-5 w-px bg-line" />
        <span className="hidden text-xs text-ink-mute lg:block">Workspace</span>
        <span className="hidden text-xs text-ink-faint lg:block">/</span>
        <p className="truncate text-[13px] font-semibold text-ink">
          {title}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <ModeToggle className="mr-1 hidden sm:flex" />
        <MessagesDropdown />
        <NotificationDropdown />
      </div>
    </header>
  )
}
