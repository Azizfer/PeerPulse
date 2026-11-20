import Header from "./Header"
import Footer from "./Footer"
import { Reveal } from "./reveal"

export interface LegalSection {
  heading: string
  body: React.ReactNode
}

/** Shared shell for /terms and /privacy. */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container-page py-14 sm:py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[52px]">
              {title}
            </h1>
            <p className="mt-4 text-lead text-ink-soft">{intro}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-[32px] border border-line bg-surface p-8 shadow-soft sm:p-10">
              <p className="text-[13.5px] text-ink-mute">
                Last updated: {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="mt-8 space-y-8">
                {sections.map((section, i) => (
                  <section key={section.heading}>
                    <h2 className="flex items-baseline gap-3 font-display text-xl font-bold tracking-[-0.02em] text-ink">
                      <span className="text-[13px] font-bold text-pulse-dark">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.heading}
                    </h2>
                    <div className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                      {section.body}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-[13.5px] text-ink-mute">
              This is a plain-language summary, not legal advice. Replace it with reviewed
              wording before launch.
            </p>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  )
}
