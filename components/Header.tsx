"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import NotificationDropdown from "./notification-dropdown"
import MessagesDropdown from "./messages-dropdown"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import UserDropdown from "./UserDropdown"

export default function Header() {
  const { isLoggedIn } = useAuth()
  const [showCommunitiesDropdown, setShowCommunitiesDropdown] = useState(false)
  const [showStudyDropdown, setShowStudyDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const studyDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCommunitiesDropdown(false)
      }
      if (studyDropdownRef.current && !studyDropdownRef.current.contains(event.target as Node)) {
        setShowStudyDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold text-[#0A0A0A] tracking-[-0.03em]" style={{ fontWeight: 800 }}>
        PeerPulse
      </Link>
        
      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {isLoggedIn ? (
          <>
            {/* Regular Links */}
            <Link 
              href="/dashboard" 
              className="text-base font-medium text-[#0A0A0A] hover:text-gray-600 transition-colors"
              style={{ fontWeight: 500 }}
            >
              Dashboard
            </Link>

            {/* Study Dropdown */}
            <div 
              className="relative" 
              ref={studyDropdownRef}
              onMouseEnter={() => setShowStudyDropdown(true)}
              onMouseLeave={() => setShowStudyDropdown(false)}
            >
              <button
                className="text-base font-medium text-[#0A0A0A] hover:text-gray-600 transition-colors flex items-center gap-1"
                style={{ fontWeight: 500 }}
              >
                Study
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showStudyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showStudyDropdown && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-52 z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    href="/study" 
                    className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">Study Sessions</div>
                    <div className="text-xs text-gray-500 mt-0.5">Start a study session</div>
                  </Link>
                  <Link 
                    href="/schedule" 
                    className="block px-4 py-3 hover:bg-gray-100 transition-colors border-t border-gray-200"
                  >
                    <div className="font-medium text-sm text-gray-900">Schedule</div>
                    <div className="text-xs text-gray-500 mt-0.5">Manage your calendar</div>
                  </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Communities Dropdown */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={() => setShowCommunitiesDropdown(true)}
              onMouseLeave={() => setShowCommunitiesDropdown(false)}
            >
              <button
                className="text-base font-medium text-[#0A0A0A] hover:text-gray-600 transition-colors flex items-center gap-1"
                style={{ fontWeight: 500 }}
              >
                Communities
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCommunitiesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showCommunitiesDropdown && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-56 z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    href="/community" 
                    className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">Feed</div>
                    <div className="text-xs text-gray-500 mt-0.5">Your community updates</div>
                  </Link>
                  <Link 
                    href="/explore" 
                    className="block px-4 py-3 hover:bg-gray-100 transition-colors border-t border-gray-200"
                  >
                    <div className="font-medium text-sm text-gray-900">Explore</div>
                    <div className="text-xs text-gray-500 mt-0.5">Discover new communities</div>
                  </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Logged out navigation
          [
            { href: "/#features", label: "Features" },
            { href: "/how-it-works", label: "How it works" },
            { href: "/pricing", label: "Pricing" },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-base font-medium text-[#0A0A0A] hover:text-gray-600 transition-colors"
              style={{ fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ))
        )}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isLoggedIn && (
          <>
            <MessagesDropdown />
            <NotificationDropdown />
            <UserDropdown />
          </>
        )}

        {!isLoggedIn && (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-base font-medium text-[#0A0A0A] hover:text-gray-600 transition-colors relative group" style={{ fontWeight: 500 }}>
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A0A0A] group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Button asChild className="relative bg-[#0A0A0A] text-white rounded-xl px-7 py-2.5 text-sm font-semibold h-auto overflow-hidden group" style={{ fontWeight: 600 }}>
              <Link href="/signup" className="relative inline-flex items-center justify-center">
                <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-300">Sign up free</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
