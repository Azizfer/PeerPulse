"use client"

import { useState } from "react"
import { Bell, CalendarDays, Check, MessageCircle, UsersRound, X } from "lucide-react"
import { HeaderDropdown } from "@/components/header-dropdown"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const initialNotifications = [
  { id: 1, title: "New message from Alex", detail: "Your study partner sent you a message.", time: "10:30 AM", icon: MessageCircle, read: false },
  { id: 2, title: "Calculus session reminder", detail: "Review your session details in Schedule.", time: "Yesterday", icon: CalendarDays, read: false },
  { id: 3, title: "Connection request from Jordan", detail: "A new peer would like to connect.", time: "2 days ago", icon: UsersRound, read: false },
  { id: 4, title: "Physics session reminder", detail: "Your scheduled study session.", time: "3 days ago", icon: CalendarDays, read: true },
  { id: 5, title: "New message from Taylor", detail: "Pick up your conversation.", time: "4 days ago", icon: MessageCircle, read: true },
]

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter(item => !item.read).length
  const markRead = (id: number) => setNotifications(previous => previous.map(item => item.id === id ? { ...item, read: true } : item))
  return (
    <HeaderDropdown title="Notifications" icon={Bell} unreadCount={unreadCount} footer={
      <DropdownMenuItem disabled={!unreadCount} onSelect={event => { event.preventDefault(); setNotifications(previous => previous.map(item => ({ ...item, read: true }))) }}
        className="cursor-pointer justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-ink focus:bg-surface-sunken focus:text-ink">
        <Check className="size-3.5" /> Mark all as read
      </DropdownMenuItem>
    }>
      {notifications.map(item => (
        <div key={item.id} className={`mb-1 flex items-start rounded-xl ${item.read ? "" : "bg-pulse-soft/40"}`}>
          <DropdownMenuItem onSelect={event => { event.preventDefault(); markRead(item.id) }}
            className="min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-ink focus:bg-surface-sunken focus:text-ink">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-pulse-dark"><item.icon className="size-3.5 !text-pulse-dark" strokeWidth={1.8} /></span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start gap-2"><span className="text-xs font-semibold leading-5">{item.title}</span>{!item.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pulse"><span className="sr-only">Unread</span></span>}</span>
              <span className="mt-0.5 block text-xs leading-5 text-ink-soft">{item.detail}</span>
              <span className="mt-1 block text-[10px] text-ink-mute">{item.time} · {item.read ? "Read" : "Select to mark read"}</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={event => { event.preventDefault(); setNotifications(previous => previous.filter(notification => notification.id !== item.id)) }}
            aria-label={`Dismiss: ${item.title}`} className="mr-1 mt-2 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg p-0 text-ink-mute focus:bg-surface-sunken focus:text-ink">
            <X className="size-3" />
          </DropdownMenuItem>
        </div>
      ))}
      {notifications.length === 0 && <div className="px-4 py-8 text-center"><Bell className="mx-auto mb-3 size-5 text-ink-mute" strokeWidth={1.6} /><p className="text-xs font-medium text-ink">All clear</p><p className="mt-1 text-xs text-ink-mute">No notifications to show.</p></div>}
    </HeaderDropdown>
  )
}
