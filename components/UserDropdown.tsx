"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut, Users } from "lucide-react"
import MenuItem from "./MenuItem"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const router = useRouter()

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

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center transition-colors"
      >
        <span className="text-white text-sm font-medium">{user?.name?.charAt(0) || "S"}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#fdfcfa] rounded-lg shadow-lg border-2 border-gray-300 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">{user?.name || "Sarah"}</p>
            <p className="text-xs text-gray-500">{user?.email || "sarah@example.com"}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <MenuItem icon={<User className="w-4 h-4" />} label="Profile" href="/profile" />
            <MenuItem icon={<Settings className="w-4 h-4" />} label="Settings" href="/settings" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex min-h-12 items-center gap-3 bg-[#fdfcfa] px-4 hover:bg-gray-100 transition-colors"
            >
              <div className="size-8 shrink-0 rounded-lg bg-[#f0f3f4] flex items-center justify-center text-[#111518]">
                <LogOut className="w-4 h-4" />
              </div>
              <p className="flex-1 truncate text-sm font-normal text-[#111518] text-left">Sign out</p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
