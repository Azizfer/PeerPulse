import Link from "next/link"
import { Globe, ShieldCheck, Video } from "lucide-react"
import Logo from "./Logo"
import { Reveal } from "./reveal"

const TRUST = [
  { icon: Video, label: "Camera optional" },
  { icon: ShieldCheck, label: "University verified" },
  { icon: Globe, label: "Free plan, forever" },
]

/**
 * Centred single-column shell shared by /login and /signup.
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-paper">
      {/* soft backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-x-0 top-0 h-[420px] opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="glow-soft -left-24 top-10 h-[380px] w-[380px] bg-pulse/18" />
        <div className="glow-soft -right-20 top-0 h-[340px] w-[340px] bg-lilac-deep/14" />
      </div>

      {/* header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo />
        <Link
          href="/"
          className="font-display text-sm font-semibold text-ink-mute transition-colors hover:text-ink"
        >
          Back to site
        </Link>
      </header>

      {/* card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16 pt-4 sm:px-8">
        <div className="w-full max-w-[440px]">
          <Reveal>
            <div className="rounded-[32px] border border-line bg-surface p-8 shadow-card sm:p-10">
              <h1 className="font-display text-[32px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
                {title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>

              <div className="mt-8">{children}</div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-7 space-y-7">
              {footer && (
                <p className="text-center text-[14.5px] text-ink-soft">{footer}</p>
              )}

              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {TRUST.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-[13px] font-medium text-ink-mute"
                  >
                    <item.icon className="h-3.5 w-3.5 text-pulse" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  )
}
