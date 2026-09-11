"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "./Logo"
import { Button } from "./ui/button"
import { useAuth } from "./auth-provider"
import NotificationDropdown from "./notification-dropdown"
import MessagesDropdown from "./messages-dropdown"
import UserDropdown from "./UserDropdown"

const LOGGED_OUT_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
]

const STUDY_LINKS = [
  {
    href: "/study",
    label: "Focus session",
    hint: "Get matched and start a 25-minute block",
  },
  { href: "/schedule", label: "Schedule", hint: "Plan recurring sessions" },
]

const COMMUNITY_LINKS = [
  { href: "/community", label: "Feed", hint: "Ask for help, share wins" },
  { href: "/explore", label: "Explore", hint: "Find communities and resources" },
]

export default function Header() {
  const { isLoggedIn } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<"study" | "community" | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(href + "/")

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-line bg-paper/85 backdrop-blur-xl supports-[backdrop-filter]:bg-paper/70"
          : "border-transparent bg-paper",
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />

        {/* ---------- Desktop nav ---------- */}
        <nav className="hidden items-center gap-1 lg:flex">
          {isLoggedIn ? (
            <>
              <NavLink href="/dashboard" active={isActive("/dashboard")}>
                Dashboard
              </NavLink>

              <Dropdown
                label="Study"
                open={openMenu === "study"}
                onOpen={() => setOpenMenu("study")}
                onClose={() => setOpenMenu(null)}
              >
                {STUDY_LINKS.map((item) => (
                  <DropdownItem key={item.href} href={item.href} hint={item.hint}>
                    {item.label}
                  </DropdownItem>
                ))}
              </Dropdown>

              <Dropdown
                label="Communities"
                open={openMenu === "community"}
                onOpen={() => setOpenMenu("community")}
                onClose={() => setOpenMenu(null)}
              >
                {COMMUNITY_LINKS.map((item) => (
                  <DropdownItem key={item.href} href={item.href} hint={item.hint}>
                    {item.label}
                  </DropdownItem>
                ))}
              </Dropdown>

              <NavLink href="/messages" active={isActive("/messages")}>
                Messages
              </NavLink>
            </>
          ) : (
            LOGGED_OUT_LINKS.map((item) => (
              <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
                {item.label}
              </NavLink>
            ))
          )}
        </nav>

        {/* ---------- Right side ---------- */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <MessagesDropdown />
              <NotificationDropdown />
              <UserDropdown />
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Start free</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-surface-sunken lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ---------- Mobile panel ---------- */}
      {mobileOpen && (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {(isLoggedIn
              ? [
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/study", label: "Focus session" },
                  { href: "/schedule", label: "Schedule" },
                  { href: "/community", label: "Community feed" },
                  { href: "/explore", label: "Explore" },
                  { href: "/messages", label: "Messages" },
                  { href: "/profile", label: "Profile" },
                ]
              : [
                  ...LOGGED_OUT_LINKS,
                  { href: "/login", label: "Log in" },
                  { href: "/signup", label: "Start free" },
                ]
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 font-display text-[15px] font-semibold text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-2 font-display text-[15px] font-semibold transition-colors",
        active ? "text-ink" : "text-ink-soft hover:text-ink",
      )}
    >
      {children}
    </Link>
  )
}

function Dropdown({
  label,
  open,
  onOpen,
  onClose,
  children,
}: {
  label: string
  open: boolean
  onOpen: () => void
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        className="flex items-center gap-1 rounded-full px-3.5 py-2 font-display text-[15px] font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        {label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full w-64 pt-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-card">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownItem({
  href,
  hint,
  children,
}: {
  href: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-surface-sunken"
    >
      <span className="block font-display text-sm font-semibold text-ink">{children}</span>
      {hint && <span className="mt-0.5 block text-[13px] leading-snug text-ink-mute">{hint}</span>}
    </Link>
  )
}
