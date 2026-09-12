"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarClock,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Plus,
  Radio,
  Search,
  Settings2,
  Users,
  BookMarked,
  ListChecks,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"

/** Collapsed-by-default groups, with nested children — Linear-style. */
const NAV: {
  title: string
  icon: React.ElementType
  items: { title: string; url: string; icon?: React.ElementType }[]
}[] = [
  {
    title: "Community",
    icon: Users,
    items: [
      { title: "Feed", url: "/community", icon: MessagesSquare },
      { title: "My communities", url: "/community", icon: Users },
      { title: "Saved", url: "/community", icon: BookMarked },
      { title: "Resources", url: "/explore", icon: BookMarked },
    ],
  },
  {
    title: "Study session",
    icon: Radio,
    items: [
      { title: "Live session", url: "/study", icon: Radio },
      { title: "Schedule session", url: "/schedule", icon: CalendarClock },
      { title: "Tasks", url: "/dashboard", icon: ListChecks },
    ],
  },
]

const TOP_LINKS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Messages", url: "/messages", icon: MessagesSquare },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const name = user?.name || "Sarah"
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Trigger + search */}
        <div className="flex items-center gap-1 px-1">
          <SidebarTrigger />
          <SidebarInput
            placeholder="Search…"
            className="group-data-[collapsible=icon]:hidden h-8 flex-1"
          />
        </div>

        {/* Primary action */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Start a session"
              className="bg-brand text-brand-foreground hover:bg-brand/90 hover:text-brand-foreground"
            >
              <Link href="/study">
                <Plus className="size-4" />
                <span>New session</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Top-level links */}
        <SidebarGroup>
          <SidebarMenu>
            {TOP_LINKS.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Collapsible groups with sub-items */}
        {NAV.map((group) => (
          <Collapsible
            key={group.title}
            defaultOpen
            className="group/collapsible"
            asChild
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="w-full">
                  <group.icon className="size-4" />
                  <span>{group.title}</span>
                  <ChevronIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((sub) => (
                      <SidebarMenuItem key={sub.title}>
                        <SidebarMenuButton asChild isActive={pathname === sub.url}>
                          <Link href={sub.url}>
                            {sub.icon ? <sub.icon className="size-4" /> : null}
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        {/* Example of a nested sub-level (kept for structure) */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Sessions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/schedule"}>
                <Link href="/schedule">
                  <CalendarClock className="size-4" />
                  <span>Upcoming</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/schedule">Today</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/schedule">This week</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-1">
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <Avatar className="size-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                    <AvatarBadge className="bg-emerald-500" />
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="text-sidebar-foreground/70 truncate text-xs">
                      {user?.email || "sarah@example.com"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings2 className="size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings2 className="size-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 ${className ?? ""}`}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
