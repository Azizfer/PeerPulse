"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'

interface Notification {
  id: number
  type: "avatar" | "bell"
  image?: string
  title: string
  subtitle: string
  read: boolean
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'avatar',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeaxElaWc-HtKQ4qy68n-3zGFjOphE7SKjD9JvNuiG5Z8Mb7RAlvGoP9Ui3iMInzRLDPrG0zh7nQWAylWkdJZD3YqQW9zPPUZygKCS_sKEC3f8fLqvj6iyNCM0NX1g0OBC3Zn8MCROjkC0LayEh4PLw8h00iTyNSB_hkuC5uS0I_Mr5XcYh-Fm2PkW29okMkwe_0khR0TCHDacWDPrQqcdj7fUZPMCKRaeWsc87mt-ofkDYMvKKYr57rtbRiZLfJnNMrFOdyNzfwU',
      title: 'New message from Alex',
      subtitle: '10:30 AM',
      read: false,
    },
    {
      id: 2,
      type: 'bell',
      title: 'Study session reminder for Calculus',
      subtitle: 'Yesterday',
      read: false,
    },
    {
      id: 3,
      type: 'avatar',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfpvQ4ZotNwW8uH-1F191SSp9Cq2aOH4NkCYJ_wok1AsDBdk7jbqouk-vQZPziywoCdSlGp1Mwga3AW93IrCe9TSRjT5Tb31gROz_PGPuSJ3sIzQJ1qWEhnFPZU6qFCCPYUX6_4dt6ZlX6MtZ4olEkE17pQSj75nP0h2ONayRuTwP6vuB3ZsHTteNhUL6Oy6FjvaO1vTpAcIl18fwh21rg1OCphuYw6t5Fq4LFA4telvX9AIa4a03_nRhkawoPsvpV_Ilq8tPAq1I',
      title: 'New connection request from Jordan',
      subtitle: '2 days ago',
      read: false,
    },
    {
      id: 4,
      type: 'bell',
      title: 'Study session reminder for Physics',
      subtitle: '3 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'avatar',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA1WJTLLEPg6Q0ZecONP2Y9GRA_yFv8roVtEU_QEs90W-zODngjn8Au5i4Tf8jJRLqG0m0D9fE3NMKy4_GNYpdzLYIlqWfAAMFOULJwRm39gOdUt-3LAXRdjJnVmJywxnvsrxR0DqKIJ-vYxKYQVOeYaqMQanTxmmRzQSDvBGaPLY2Ng7E9ucQwKorLG26YrwhQCX4-mbFB7j__LFDAvY6WByk6mjjnV8p0jCRwSmdLU_TpzIxBanXPJmgTezr6Eb9-645YsLgpHs',
      title: 'New message from Taylor',
      subtitle: '4 days ago',
      read: true,
    },
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const handleViewAll = () => {
    setIsOpen(false)
    // Navigate to notifications page
    window.location.href = '/notifications'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-9 w-9 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="w-4 h-4 text-ink-soft" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <div className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-deep px-1 ring-2 ring-paper">
              <span className="text-[10px] text-white font-bold leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 max-h-80 w-96 overflow-y-auto rounded-2xl border border-line bg-surface shadow-card"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-line">
              <h1 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-ink-mute mt-1">
                  {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {/* Notifications List */}
            <div>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-ink-mute">
                  <Bell className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {notifications.map((notification, index) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex min-h-[56px] items-center gap-3 px-4 py-1.5 hover:bg-surface-sunken transition-colors relative group ${
                        !notification.read ? 'border-l-[3px] border-l-pulse bg-pulse-soft/40' : 'border-l-[3px] border-l-transparent bg-surface'
                      }`}
                    >
                      {/* Avatar or Bell Icon */}
                      {notification.type === 'avatar' && notification.image ? (
                        <Image
                          src={notification.image || "/placeholder.svg"}
                          width={48}
                          height={48}
                          alt=""
                          className="aspect-square h-12 w-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-ink">
                          <svg
                            viewBox="0 0 256 256"
                            width={24}
                            height={24}
                            fill="currentColor"
                            aria-hidden
                          >
                            <path d="M221.8 175.94C216.25 166.38 208 139.33 208 104a80 80 0 10-160 0c0 35.34-8.26 62.38-13.81 71.94A16 16 0 0048 200h40.81a40 40 0 0078.38 0H208a16 16 0 0013.8-24.06ZM128 216a24 24 0 01-22.62-16h45.24A24 24 0 01128 216ZM48 184c7.7-13.24 16-43.92 16-80a64 64 0 11128 0c0 36.05 8.28 66.73 16 80Z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-tight ${
                          notification.read ? 'text-ink-mute' : 'text-ink'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-xs font-normal leading-snug text-ink-mute">
                          {notification.subtitle}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="p-1 h-6 w-6 text-ink-faint hover:text-green-600"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="p-1 h-6 w-6 text-ink-faint hover:text-red-600"
                          title="Remove notification"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer Buttons */}
            {notifications.length > 0 && (
              <div className="flex flex-wrap justify-between gap-3 px-4 py-3 border-t border-line">
                <button 
                  onClick={markAllAsRead}
                  className="flex h-8 min-w-[72px] items-center justify-center overflow-hidden rounded-lg bg-surface-sunken px-3 text-xs font-semibold tracking-[0.015em] text-ink hover:bg-gray-200 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
