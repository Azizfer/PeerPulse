import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "./Logo"
import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"

/**
 * Centred card shell for the three onboarding steps.
 * `step` is 1-based; pass `complete` to paint the progress bar done.
 */
export default function OnboardingLayout({
  step,
  title,
  subtitle,
  backHref,
  complete = false,
  children,
}: {
  step: number
  title: string
  subtitle: string
  backHref?: string
  complete?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-x-0 top-0 h-[360px] opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="glow-soft -left-24 top-6 h-[340px] w-[340px] bg-pulse/18" />
        <div className="glow-soft -right-20 top-0 h-[300px] w-[300px] bg-lilac-deep/14" />
      </div>

      <header className="relative z-10 px-6 py-6 sm:px-10">
        <Logo />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16 sm:px-8">
        <div className="w-full max-w-[480px]">
          {backHref && (
            <Link
              href={backHref}
              className="mb-6 inline-flex items-center gap-2 text-[14px] text-ink-mute transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          )}

          <Reveal>
            <div className="mb-5 flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={cn(
                      "h-1.5 w-12 rounded-full transition-colors",
                      complete || n <= step ? "bg-pulse" : "bg-line",
                    )}
                  />
                ))}
              </div>
              <p className="text-[13px] font-medium text-ink-mute">
                {complete ? "Setup complete" : `Step ${step} of 3`}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-[28px] border border-line bg-surface p-7 shadow-card sm:p-8">
              <h1 className="font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
                {title}
              </h1>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>

              <div className="mt-7">{children}</div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  )
}
