import Link from "next/link"
import Logo from "./Logo"
import { Reveal } from "./reveal"
import { Avatar } from "./avatar"

/**
 * Split-screen shell shared by /login and /signup.
 * Left: the form. Right: a quiet bit of proof that this is worth signing up for.
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
    <div className="grid min-h-screen lg:grid-cols-[1fr_0.95fr]">
      {/* ---------------- Left: form ---------------- */}
      <div className="flex flex-col bg-paper">
        <div className="container-page flex items-center justify-between py-6">
          <Logo />
          <Link
            href="/"
            className="font-display text-sm font-semibold text-ink-mute transition-colors hover:text-ink"
          >
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-4 sm:px-8">
          <div className="w-full max-w-[420px]">
            <Reveal>
              <h1 className="font-display text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
                {title}
              </h1>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-8">{children}</div>
            </Reveal>

            {footer && (
              <Reveal delay={0.12}>
                <div className="mt-8 border-t border-line pt-6 text-center text-[14.5px] text-ink-soft">
                  {footer}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Right: proof ---------------- */}
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-pulse/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-lilac-deep/30 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
            </span>
            Live now · 248 students in focus rooms
          </div>

          <div>
            <blockquote className="max-w-md font-display text-[26px] font-bold leading-[1.25] tracking-[-0.025em] text-white">
              “Twenty-five minutes next to someone who is also working did more for my grades
              than a whole semester of studying alone.”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <Avatar name="Sana Benali" size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">Sana Benali</p>
                <p className="text-[13px] text-white/55">Statistics, Year 2</p>
              </div>
            </div>
          </div>

          <ul className="space-y-3">
            {[
              "Matched by subject in about 30 seconds",
              "Camera and mic stay under your control",
              "Community answers, saved to your course",
            ].map((line) => (
              <li key={line} className="flex items-center gap-3 text-[14.5px] text-white/70">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/12">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-pulse" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
