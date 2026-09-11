import Link from "next/link"
import Logo from "./Logo"

const COLUMNS = [
  {
    title: "Study",
    links: [
      { href: "/study", label: "Focus sessions" },
      { href: "/schedule", label: "Scheduling" },
      { href: "/explore", label: "Find peers" },
      { href: "/features", label: "All features" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Feed" },
      { href: "/messages", label: "Messages" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-warm">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-mute">
              A calm place to study with people who are working through the same material —
              plus the community and resources that keep you going.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-pulse" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
              </span>
              Built for students, by students
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-sm text-ink-mute">
            © {new Date().getFullYear()} PeerPulse. All rights reserved.
          </p>
          <p className="text-sm text-ink-mute">
            Made for late nights, group projects and exam week.
          </p>
        </div>
      </div>
    </footer>
  )
}
