"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, Settings, User } from "lucide-react"
import MenuItem from "./MenuItem"
import { Avatar } from "./avatar"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account menu"
        className="rounded-full outline-none transition-transform hover:scale-105"
      >
        <Avatar name={user?.name || "Sarah"} size="sm" status="online" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-64 pt-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <div className="border-b border-line px-4 py-3">
              <p className="font-display text-sm font-bold text-ink">{user?.name || "Sarah"}</p>
              <p className="truncate text-[12.5px] text-ink-mute">
                {user?.email || "sarah@example.com"}
              </p>
            </div>

            <div className="py-1.5">
              <MenuItem icon={<User className="h-4 w-4" />} label="Profile" href="/profile" />
              <MenuItem icon={<Settings className="h-4 w-4" />} label="Settings" href="/settings" />
            </div>

            <div className="border-t border-line py-1.5">
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center gap-3 px-4 text-left transition-colors hover:bg-surface-sunken"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-sunken text-ink-soft">
                  <LogOut className="h-4 w-4" />
                </span>
                <span className="flex-1 truncate text-sm text-ink">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
