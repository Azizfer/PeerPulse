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
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-pulse/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-lilac-deep/20 blur-3xl" />

      <div className="container-page relative py-16 sm:py-20">
        {/* ---------------- Top ---------------- */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo size="xl" tone="light" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/55">
              Focus rooms matched by subject. Show up, say what you&apos;ll do, then do it
              next to someone doing the same.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="shrink-0 bg-white text-ink hover:bg-white/90"
          >
            <Link href="/signup">Get started — it&apos;s free</Link>
          </Button>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />

        {/* ---------------- Columns ---------------- */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-white/40">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] text-white/70 transition-colors hover:text-white"
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
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[13.5px] text-white/45">Made in PeerPulse</p>
          <p className="text-[13.5px] text-white/45">
            © {new Date().getFullYear()} PeerPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
