import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { Section, SectionHeading } from "@/components/section"
import { PricingPlans } from "@/components/marketing/pricing-plans"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free, upgrade when studying together becomes a habit.",
}

const PREMIUM_HIGHLIGHTS = [
  {
    title: "Study groups",
    body: "Open a room for your whole course — up to 8 people, with the same timer and debrief.",
  },
  {
    title: "Advanced scheduling",
    body: "Book recurring sessions with the partners that work for you, and get reminded.",
  },
  {
    title: "Analytics that mean something",
    body: "See which subjects you actually put hours into, and which ones you've been avoiding.",
  },
]

const FAQS = [
  {
    q: "Can I switch from Free to Premium anytime?",
    a: "Yes. Upgrades apply immediately and you keep your streak, history and partners.",
  },
  {
    q: "What happens if I cancel?",
    a: "You keep Premium until the end of the billing period, then drop back to Free. Nothing is deleted.",
  },
  {
    q: "Is there a student discount?",
    a: "Yes — 50% off Premium with a valid student email or ID. It's applied automatically at checkout.",
  },
  {
    q: "How does the trial work?",
    a: "14 days of Premium, no credit card. If you do nothing, you simply fall back to the Free plan.",
  },
  {
    q: "Can I use PeerPulse on my phone?",
    a: "The web app works on mobile browsers today. Native apps are on the roadmap.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-soft -top-24 left-1/4 h-[380px] w-[380px] bg-pulse/15" />
          <div className="glow-soft -right-16 top-10 h-[320px] w-[320px] bg-lilac-deep/12" />
        </div>

        <div className="container-page relative py-20 text-center sm:py-24">
          <Reveal>
            <p className="eyebrow">Pricing</p>
            <h1 className="mx-auto mt-4 max-w-3xl text-h2 font-extrabold text-ink">
              Free until it becomes a habit. Then{" "}
              <span className="font-serif font-normal italic tracking-normal text-pulse-dark">
                cheap
              </span>
              .
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lead text-ink-soft">
              No seat licences, no campus contracts. One student, one plan, cancel in two clicks.
            </p>
          </Reveal>

        </div>
      </section>

      {/* ---------------- Plans ---------------- */}
      <Section>
        <PricingPlans />
      </Section>

      {/* ---------------- Highlights ---------------- */}
      <Section className="border-y border-line bg-surface-sunken">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Why upgrade"
              title="What Premium actually changes"
              description="The free plan is enough to study with someone tonight. These are the things people come back for."
            />
          </Reveal>

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {PREMIUM_HIGHLIGHTS.map((item) => (
              <RevealItem key={item.title}>
                <div className="h-full rounded-3xl border border-line bg-surface p-7 shadow-soft">
                  <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------- FAQ ---------------- */}
      <Section>
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Questions people actually ask" />
          </Reveal>

          <div className="mx-auto mt-12 max-w-2xl divide-y divide-line">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-display text-[16px] font-bold text-ink">{faq.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-sunken text-ink-soft transition-transform duration-200 group-open:rotate-45">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-[15px] leading-relaxed text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- Closing CTA ---------------- */}
      <Section className="pt-0">
        <div className="container-page">
          <Reveal>
            <div className="rounded-[32px] border border-line bg-paper-warm px-8 py-12 text-center">
              <h2 className="font-display text-2xl font-extrabold tracking-[-0.025em] text-ink">
                Still deciding?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Start on Free. You can be in a focus room with someone in your subject in about
                two minutes — no card, no commitment.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/signup">Create free account</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/features">Compare features</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Footer />
    </div>
  )
}
