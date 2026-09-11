"use client"

import Link from "next/link"
import { ArrowRight, Play, Activity, Hourglass, Users, Video, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { Section, SectionHeading } from "@/components/section"
import { FocusRoomMock } from "@/components/marketing/focus-room-mock"
import { CommunityMock } from "@/components/marketing/community-mock"
import { AiMock } from "@/components/marketing/ai-mock"
import { Avatar } from "@/components/avatar"
import DashboardPage from "./dashboard/page"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const { isLoggedIn } = useAuth()
  // Signed-in members land straight on their dashboard; everyone else sees marketing.
  return isLoggedIn ? <DashboardPage /> : <LandingPage />
}

const STATS = [
  { value: "12,400+", label: "students studying together" },
  { value: "48k", label: "focus hours logged" },
  { value: "94%", label: "say they procrastinate less" },
  { value: "32s", label: "average time to match" },
]

const STEPS = [
  {
    n: "01",
    title: "Tell us your subjects",
    body: "Add your university, your subjects and the topics you're working on. That's the whole profile.",
  },
  {
    n: "02",
    title: "Get matched in seconds",
    body: "Hit start and PeerPulse pairs you with someone studying the same thing, at the same level, right now.",
  },
  {
    n: "03",
    title: "Work in a quiet room",
    body: "Camera on or off, mic muted by default. A shared timer keeps the session honest and short.",
  },
  {
    n: "04",
    title: "Debrief and keep going",
    body: "Tick off what you did, save it to your streak, and book the next one before you close the tab.",
  },
]

// No box, no shadow, no colored chip — same bare "icon / rule / heading / body" language
// as the numbered steps section right below, so the two read as one system.
const FEATURES = [
  {
    icon: Users,
    iconColor: "text-lilac-deep",
    title: "Matching that actually matches",
    body: "We pair on subject, topic and availability — not vibes. Filter by course, level or language before you join.",
  },
  {
    icon: Video,
    iconColor: "text-sky-deep",
    title: "Camera and mic, your call",
    body: "Join with video, audio or neither. Toggle either one mid-session without dropping the call.",
  },
  {
    icon: Hourglass,
    iconColor: "text-apricot-deep",
    title: "Pomodoro built in",
    body: "25-minute deep work blocks with short breaks, and a debrief at the end so the session feels finished.",
  },
  {
    icon: Activity,
    iconColor: "text-pulse-dark",
    title: "Pulse, your study assistant",
    body: "Turns your syllabus into a plan, quizzes you on weak topics, and finds the resource someone already shared.",
  },
]

const TESTIMONIALS = [
  {
    name: "Sana Benali",
    role: "Statistics · Year 2",
    quote:
      "I used to 'study' for four hours and retain nothing. Twenty-five minutes next to someone actually working changed everything.",
  },
  {
    name: "Yassine Trabelsi",
    role: "Computer Science · Year 3",
    quote:
      "Being matched by exact module is the whole thing. I've met three people from my algorithms class I'd never have spoken to.",
  },
  {
    name: "Nour Hadded",
    role: "Medicine · Year 4",
    quote:
      "The camera thing sounded awful. It isn't — nobody's looking at you, everybody's working. It just makes you show up.",
  },
]

const UNIVERSITIES = [
  "Sciences Po",
  "TU Delft",
  "Université de Tunis",
  "Politecnico di Milano",
  "Sorbonne",
  "KAUST",
  "ETH Zürich",
  "McGill",
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        {/* backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="dot-grid absolute inset-x-0 top-0 h-[520px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="glow-soft -left-24 top-24 h-[420px] w-[420px] bg-pulse/20" />
          <div className="glow-soft -right-24 top-0 h-[420px] w-[420px] bg-lilac-deep/15" />
        </div>

        <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink-soft shadow-soft">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-pulse" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
                </span>
                Body doubling for students
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-7 text-display font-extrabold text-ink">
                <span className="block">Stop studying alone.</span>
                <span className="block">Get matched by subject.</span>
                <span className="block text-pulse-dark">Go pass your exams.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 max-w-lg text-lead text-ink-soft">
                Join a 25-minute focus room with someone in the same class. Camera optional.
                Timer running. That&apos;s the whole trick — and it works.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="group">
                  <Link href="/signup">
                    Get started — it's free
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link href="/how-it-works">
                    <Play className="h-4 w-4" />
                    See how it works
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} y={24}>
            <FocusRoomMock />
          </Reveal>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="border-y border-line bg-paper-warm">
        <div className="container-page grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div>
                <p className="font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] text-ink sm:text-[42px]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[13.5px] leading-snug text-ink-mute">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ LOGOS ============================ */}
      <section className="overflow-hidden py-10">
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Students from 200+ universities
        </p>
        <div className="relative mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12 pr-12">
            {[...UNIVERSITIES, ...UNIVERSITIES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink-faint/80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <Section id="features" className="relative">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title={
                <>
                  <span className="block">Everything a session needs.</span>
                  <span className="block text-ink-mute">Nothing it doesn&apos;t.</span>
                </>
              }
              description="No feeds to scroll, no streaks to perform for. Just the four things that make studying next to someone else work."
            />
          </Reveal>

          <RevealGroup className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <RevealItem key={feature.title}>
                <div className="h-full">
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} strokeWidth={1.5} />
                  <div className="mt-4 h-px w-full bg-line-strong" />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.02em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                    {feature.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ============================ HOW IT WORKS ============================ */}
      <Section className="border-y border-line bg-surface-sunken">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title={
                <>
                  <span className="block">Set it up once.</span>
                  <span className="block text-ink-mute">Be studying in two minutes.</span>
                </>
              }
            />
          </Reveal>

          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <RevealItem key={step.n}>
                <div className="relative h-full">
                  <span className="font-display text-[13px] font-bold tracking-[0.1em] text-pulse-dark">
                    {step.n}
                  </span>
                  <div className="mt-3 h-px w-full bg-line-strong" />
                  <h3 className="mt-4 font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="mt-12 flex justify-center">
              <Button asChild variant="secondary">
                <Link href="/how-it-works">
                  Read the full walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============================ FOCUS ROOMS ============================ */}
      <Section>
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="glow-soft -left-10 top-10 h-60 w-60 bg-sky/40" />
              <div className="relative rounded-[28px] border border-line bg-surface p-6 shadow-card">
                <p className="eyebrow">In session</p>
                <p className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">
                  Camera on. Mic muted. Timer running.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    {
                      icon: Video,
                      label: "Camera",
                      value: "On — everyone can see you working",
                      tone: "bg-pulse-soft text-pulse-dark",
                    },
                    {
                      icon: undefined,
                      label: "Microphone",
                      value: "Muted during deep work, unmuted at debrief",
                      tone: "bg-surface-sunken text-ink-soft",
                    },
                    {
                      icon: Timer,
                      label: "Timer",
                      value: "25:00 · one short break at the halfway mark",
                      tone: "bg-lilac text-lilac-deep",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5"
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-xl ${row.tone}`}>
                        {row.icon ? <row.icon className="h-4 w-4" /> : null}
                      </span>
                      <div className="min-w-0">
                        <p className="font-display text-sm font-bold text-ink">{row.label}</p>
                        <p className="truncate text-[13px] text-ink-mute">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-[13.5px] leading-relaxed text-ink-mute">
                  Leave anytime. Nothing is recorded. Screen sharing is off by default so
                  nobody ends up on camera by accident.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading
              align="left"
              eyebrow="Focus rooms"
              title="Body doubling, minus the awkward bit"
              description="Working next to someone who is also working is the oldest productivity trick there is. PeerPulse just removes the scheduling, the small talk and the coffee shop."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Matched on subject, level and time zone — not at random",
                "Sessions capped at 4 people so nobody hides",
                "Shared goal list at the start, quick debrief at the end",
                "Works with camera off if you'd rather stay off screen",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pulse-soft text-pulse-dark">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink-soft">{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/study">
                  Try a focus room
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============================ COMMUNITIES ============================ */}
      <Section className="border-y border-line bg-paper-warm">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Communities"
              title="Ask for help. Share what worked."
              description="Every subject gets a space where people post questions, drop past papers and answer each other. Resources are searchable and tied to the course, so they don't disappear into a group chat."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/community">Open the feed</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/explore">Browse resources</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <CommunityMock />
          </Reveal>
        </div>
      </Section>

      {/* ============================ AI ============================ */}
      <Section>
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal delay={0.1} className="order-2 lg:order-1">
            <AiMock />
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Pulse AI"
              title="An assistant that knows what you&apos;re studying"
              description="Pulse reads your subjects, your goals and what your community already shared — then makes a plan, quizzes you, or finds the person who already solved the problem you're stuck on."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Turns a syllabus or past paper into a day-by-day revision plan",
                "Generates practice questions from your own notes and resources",
                "Answers with sources from your community, not made-up citations",
                "Books the focus room for you when you need accountability",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pulse-soft text-pulse-dark">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink-soft">{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ============================ TESTIMONIALS ============================ */}
      <Section className="border-t border-line bg-surface-sunken">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="From our members"
              title={
                <>
                  <span className="block">&ldquo;I came for the focus.</span>
                  <span className="block text-ink-mute">I stayed for the people.&rdquo;</span>
                </>
              }
            />
          </Reveal>

          <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <RevealItem key={t.name}>
                <figure className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-7 shadow-soft">
                  <blockquote className="text-[15px] leading-relaxed text-ink-soft">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Avatar name={t.name} size="sm" />
                    <div>
                      <p className="font-display text-sm font-bold text-ink">{t.name}</p>
                      <p className="text-[13px] text-ink-mute">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ============================ CTA ============================ */}
      <Section className="pb-24">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-16 text-center sm:px-16">
              <div className="pointer-events-none absolute -left-10 -top-16 h-72 w-72 rounded-full bg-pulse/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-lilac-deep/30 blur-3xl" />

              <div className="relative mx-auto max-w-2xl">
                <h2 className="mt-6 text-h2 font-extrabold text-white">
                  Your next exam just got less lonely.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lead text-white/70">
                  Set up your subjects once. Get matched with someone in the same class tonight.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
                    className="text-white/80 hover:bg-white/10 hover:text-white"
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