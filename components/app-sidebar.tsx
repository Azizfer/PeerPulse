"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChevronsUpDown,
  House,
  FolderClosed,
  LogOut,
  Inbox,
  Video,
  Plus,
  UserRound,
  ChevronDown,
  type LucideIcon,
  Settings2,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { PeerPulseMark } from "@/components/peerpulse-mark"

type NavigationItem = { title: string; url: string; icon: LucideIcon; children?: { title: string; url: string }[] }
const NAV_ITEMS: NavigationItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: House },
  { title: "Study room", url: "/study", icon: Video, children: [
    { title: "Peer-to-peer session", url: "/study" },
    { title: "Solo Pomodoro", url: "/study/solo" },
    { title: "Group sessions", url: "/study/groups" },
  ] },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Community", url: "/community", icon: Users, children: [
    { title: "Feed", url: "/community" },
    { title: "Communities", url: "/communities" },
  ] },
  { title: "Resources", url: "/explore", icon: FolderClosed },
  { title: "Messages", url: "/messages", icon: Inbox },
]

function NavigationGroup({ item }: { item: NavigationItem }) {
  const pathname = usePathname()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const active = item.children?.some(child => pathname === child.url) ?? false
  const Icon = item.icon
  if (state === "collapsed" && !isMobile) {
    return <DropdownMenu><DropdownMenuTrigger asChild><SidebarMenuButton tooltip={item.title} isActive={active} className="mx-auto size-10! justify-center rounded-xl p-0!"><Icon className="size-4!" strokeWidth={1.8} /><span className="sr-only">{item.title}</span></SidebarMenuButton></DropdownMenuTrigger><DropdownMenuContent side="right" sideOffset={12} className="w-52 rounded-2xl border-line bg-surface p-1.5">{item.children?.map(child => <DropdownMenuItem key={child.url} asChild><Link href={child.url} aria-current={pathname === child.url ? "page" : undefined}>{child.title}</Link></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
  }
  return (
    <Collapsible defaultOpen={active} className="group/navigation">
      <CollapsibleTrigger asChild><SidebarMenuButton isActive={active} className="h-10 rounded-xl px-3 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/70"><Icon className="size-4!" strokeWidth={1.8} /><span>{item.title}</span><ChevronDown className="ml-auto size-3.5! transition-transform group-data-[state=open]/navigation:rotate-180" /></SidebarMenuButton></CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <SidebarMenuSub className="ml-5 mr-0 my-1 border-line pl-3">
          {item.children?.map(child => <SidebarMenuSubItem key={child.url}><SidebarMenuSubButton asChild isActive={pathname === child.url} className="h-9 rounded-lg text-xs text-ink-soft data-[active=true]:bg-pulse-soft data-[active=true]:text-pulse-dark"><Link href={child.url} onClick={() => setOpenMobile(false)} aria-current={pathname === child.url ? "page" : undefined}><span>{child.title}</span></Link></SidebarMenuSubButton></SidebarMenuSubItem>)}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const name = user?.name || "Sarah"
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
  const isActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-4 px-3 pb-4 pt-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="PeerPulse"
              className="h-11 rounded-xl px-1.5 hover:bg-transparent group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-0!"
            >
              <Link href="/dashboard">
                <PeerPulseMark className="size-9 group-data-[collapsible=icon]:size-10" />
                <span className="min-w-0 flex-1 truncate font-brand text-[17px] font-bold tracking-[-0.04em] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  PeerPulse
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Start a session"
              className="h-10 rounded-xl border border-brand/20 bg-brand/10 px-3 text-brand shadow-none hover:border-brand/30 hover:bg-brand/15 hover:text-brand group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-brand group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:text-brand-foreground group-data-[collapsible=icon]:shadow-sm"
            >
              <Link href="/study">
                <Plus className="size-4!" strokeWidth={1.8} />
                <span className="font-semibold group-data-[collapsible=icon]:hidden">Start session</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 group-data-[collapsible=icon]:px-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-mute">Workspace</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.children ? <NavigationGroup item={item} /> : <SidebarMenuButton
                  asChild
                  size="lg"
                  isActive={isActive(item.url)}
                  tooltip={item.title}
                  className="h-10 rounded-xl px-3 text-[14px] font-medium text-sidebar-foreground/70 data-[active=true]:bg-brand/10 data-[active=true]:font-semibold data-[active=true]:text-brand hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4! shrink-0" strokeWidth={1.8} />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2 group-data-[collapsible=icon]:p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Account"
                  className="h-12 rounded-xl px-2 data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1!"
                >
                  <Avatar className="size-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                    <AvatarBadge className="bg-emerald-500 dark:bg-emerald-500" />
                  </Avatar>
                  <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-[13px] font-semibold text-sidebar-foreground">{name}</span>
                    <span className="truncate text-[11px] text-sidebar-foreground/60">
                      {user?.email || "sarah@example.com"}
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/55 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" sideOffset={8} className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-ink">{name}</p>
                    <p className="truncate text-xs text-ink-mute">{user?.email || "sarah@example.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserRound className="size-4" strokeWidth={1.8} /> Profile
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
