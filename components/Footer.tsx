import Link from "next/link"
import Logo from "./Logo"
import { Button } from "./ui/button"

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/study", label: "Focus sessions" },
      { href: "/schedule", label: "Scheduling" },
      { href: "/community", label: "Community feed" },
      { href: "/explore", label: "Find peers" },
      { href: "/messages", label: "Messages" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/explore", label: "Browse communities" },
      { href: "/how-it-works", label: "How sessions run" },
      { href: "/features", label: "All features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/how-it-works", label: "Getting started" },
      { href: "/features", label: "Study methods" },
      { href: "/pricing", label: "Student discount" },
      { href: "/contact", label: "Help centre" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "mailto:hello@peerpulse.app", label: "hello@peerpulse.app" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms and Conditions" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8 sm:py-12">
        {/* ---------------- Top ---------------- */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo size="lg" tone="light" />
            <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-white/60">
              Focus rooms matched by subject. Show up, say what you&apos;ll do, then do it
              next to someone doing the same.
            </p>
          </div>

          <Button
            asChild
            size="default"
            className="shrink-0 bg-white text-ink hover:bg-white/90"
          >
            <Link href="/signup">Get started — it&apos;s free</Link>
          </Button>
        </div>

        {/* ---------------- Columns ---------------- */}
        <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                {col.title}
              </h3>
              <ul className="mt-3.5 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---------------- Bottom ---------------- */}
        <div className="mt-9 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <p className="text-[12.5px] text-white/55">Made in PeerPulse</p>
          <p className="text-[12.5px] text-white/55">
            © {new Date().getFullYear()} PeerPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
