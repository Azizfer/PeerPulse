import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, MessageSquare, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { Section, SectionHeading } from "@/components/section"

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From signing up to finishing a 55-minute focus session with someone in your subject.",
}

const STEPS = [
  {
    n: "01",
    title: "Set up your subjects",
    body: "Add your university, the subjects you're taking this term, and the topics you find hard. It takes about two minutes and it's the only setup we ask for.",
    points: ["University and programme", "Subjects and current topics", "When you usually study"],
  },
  {
    n: "02",
    title: "Get matched",
    body: "Press start and we look for someone online in the same subject, at a similar level, in a compatible time zone. Most matches take under a minute.",
    points: ["Matched on course overlap first", "Filter by language or level", "Skip a match, no explanations needed"],
  },
  {
    n: "03",
    title: "Work in the room",
    body: "Two or three other people, a shared 25-minute timer, and your camera and mic under your control. Mics are muted during deep work by default.",
    points: ["Camera optional, toggle anytime", "Shared goal list", "Chat and whiteboard if you need them"],
  },
  {
    n: "04",
    title: "Debrief and repeat",
    body: "At the end, everyone says what they got done. Tick your goals, save the session, and book the next one before you close the tab.",
    points: ["Session summary saved", "Streaks and stats", "Re-book the same partner"],
  },
]

const RULES = [
  {
    icon: Video,
    title: "Camera on if you can",
    body: "It's what makes the room feel like a room. But a third of members stay off camera and that's completely fine.",
  },
  {
    icon: MessageSquare,
    title: "Talk at the edges",
    body: "Goals at the start, a debrief at the end, silence in between. Nobody wants a conversation at minute twelve.",
  },
  {
    icon: Check,
    title: "One thing at a time",
    body: "Pick the smallest concrete task you can finish in a block. 'Revise biology' never works; 'finish problem set 7' does.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-soft -left-16 top-4 h-[340px] w-[340px] bg-pulse/15" />
          <div className="glow-soft -right-10 top-0 h-[300px] w-[300px] bg-lilac-deep/12" />
        </div>
        <div className="container-page relative py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="How it works"
              title="Four steps, about two minutes each"
              description="The whole thing is designed so that the gap between deciding to study and actually studying is as small as possible."
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Steps ---------------- */}
      <Section>
        <div className="container-page">
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            {STEPS.map((step) => (
              <RevealItem key={step.n} className="h-full">
                <div className="flex h-full flex-col rounded-[32px] border border-line bg-surface p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <span className="font-display text-[13px] font-bold tracking-[0.1em] text-pulse-dark">
                    {step.n}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.025em] text-ink">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-pulse-soft text-pulse-dark">
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </span>
                        <span className="text-[14px] text-ink-soft">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------- Rules ---------------- */}
      <Section className="border-y border-line bg-surface-sunken">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="House rules"
              title="Three things that make a session work"
            />
          </Reveal>

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {RULES.map((rule) => (
              <RevealItem key={rule.title}>
                <div className="h-full rounded-3xl border border-line bg-surface p-7 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lilac text-lilac-deep">
                    <rule.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    {rule.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{rule.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------- CTA ---------------- */}
      <Section>
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-16 text-center sm:px-16">
              <div className="pointer-events-none absolute -left-10 -top-16 h-72 w-72 rounded-full bg-pulse/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-lilac-deep/30 blur-3xl" />
              <div className="relative mx-auto max-w-xl">
                <h2 className="text-h2 font-extrabold text-white">
                  Your next session is 30 seconds away.
                </h2>
                <p className="mt-4 text-lead text-white/70">
                  Set up your subjects once, then get matched whenever you sit down to work.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" variant="subtle" className="bg-white text-ink hover:bg-white/90">
                    <Link href="/signup">
                      Create your free account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/pricing">See pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Footer />
    </div>
  )
}
