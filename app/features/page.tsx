import type { Metadata } from "next"
import Link from "next/link"
import {
  Bell,
  CalendarClock,
  FileText,
  Gauge,
  Mic,
  Shield,
  Sparkles,
  Users,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { Section, SectionHeading } from "@/components/section"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Subject-matched pairing, focus rooms with camera and mic control, Pomodoro timers, communities and a study assistant.",
}

const FEATURES = [
  {
    icon: Users,
    tint: "bg-lilac text-lilac-deep",
    title: "Subject-level matching",
    body: "Tell us your university, subjects and topics. Our matcher weighs course overlap, level and time zone before anything else.",
  },
  {
    icon: Video,
    tint: "bg-sky text-sky-deep",
    title: "Focus rooms",
    body: "Small rooms capped at four people with video tiles, a shared timer and a chat that only exists for that session.",
  },
  {
    icon: Mic,
    tint: "bg-pulse-soft text-pulse-dark",
    title: "Camera and mic, yours to control",
    body: "Join with video, audio or neither. Toggle either mid-session, switch devices, and stay muted by default during deep work.",
  },
  {
    icon: FileText,
    tint: "bg-apricot text-apricot-deep",
    title: "Shared whiteboard",
    body: "Sketch a proof or a diagram together without leaving the room. Exports to PNG so it lands in your notes.",
  },
  {
    icon: Gauge,
    tint: "bg-rose text-rose-deep",
    title: "Pomodoro that fits the session",
    body: "25/5 by default, configurable to 50/10 or a custom block. The timer is shared, so nobody drifts.",
  },
  {
    icon: CalendarClock,
    tint: "bg-lemon text-lemon-deep",
    title: "Scheduling and reminders",
    body: "Book a recurring slot with a partner you like, and get a nudge ten minutes before the room opens.",
  },
  {
    icon: Sparkles,
    tint: "bg-lilac text-lilac-deep",
    title: "Pulse, the study assistant",
    body: "Turns a syllabus into a plan, quizzes you on weak topics, and points you at resources your community already shared.",
  },
  {
    icon: Bell,
    tint: "bg-sky text-sky-deep",
    title: "Communities and resources",
    body: "One feed per subject: questions, past papers and summaries, searchable and tied to the course they belong to.",
  },
]

const TIMELINE = [
  { time: "0:00", title: "Goals", body: "Everyone types what they'll work on. Thirty seconds, no discussion." },
  { time: "0:30", title: "Deep work", body: "Timer starts, mics mute, cameras stay on if you want them to." },
  { time: "25:00", title: "Break", body: "Five minutes. Stretch, or keep working — nobody will stop you." },
  { time: "55:00", title: "Debrief", body: "Say what you got done. Tick it off. Book the next one if it worked." },
]

const PRIVACY = [
  {
    icon: Shield,
    title: "Nothing is recorded",
    body: "Sessions are live only. There is no recording, no transcript, no replay to worry about.",
  },
  {
    icon: Video,
    title: "Camera off is a first-class option",
    body: "Roughly a third of members keep video off. You can flip it at any point in the session.",
  },
  {
    icon: Users,
    title: "Report and block, instantly",
    body: "One click removes someone from your room and stops them from being matched with you again.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className="dot-grid absolute inset-x-0 top-0 h-[420px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="glow-soft -left-20 top-10 h-[360px] w-[360px] bg-pulse/15" />
          <div className="glow-soft -right-10 top-0 h-[320px] w-[320px] bg-lilac-deep/12" />
        </div>

        <div className="container-page relative py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Features"
              title="Built for the two hours before a deadline"
              description="Every feature here exists because studying alone kept failing. None of them exist to keep you on the app longer."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/signup">Start free</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/how-it-works">See how a session runs</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Grid ---------------- */}
      <Section>
        <div className="container-page">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <RevealItem key={feature.title}>
                <div className="group h-full rounded-3xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-card">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${feature.tint}`}>
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[17px] font-bold leading-snug tracking-[-0.02em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{feature.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------- Session anatomy ---------------- */}
      <Section className="border-y border-line bg-surface-sunken">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Inside a session"
              title="What actually happens in 55 minutes"
              description="The structure is the point. It's short, predictable, and it ends — which is why people come back to it."
            />
          </Reveal>

          <RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {TIMELINE.map((step) => (
              <RevealItem key={step.time}>
                <div className="flex h-full gap-4 rounded-3xl border border-line bg-surface p-6 shadow-soft">
                  <span className="font-display text-[13px] font-bold tabular-nums text-pulse-dark">
                    {step.time}
                  </span>
                  <div>
                    <h3 className="font-display text-[16px] font-bold text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------- Privacy ---------------- */}
      <Section>
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Safety"
              title="You decide how visible you are"
              description="Body doubling only works if you feel safe in the room. So the controls are blunt and immediate."
            />
          </Reveal>

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {PRIVACY.map((item) => (
              <RevealItem key={item.title}>
                <div className="h-full rounded-3xl border border-line bg-surface p-7 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pulse-soft text-pulse-dark">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ---------------- CTA ---------------- */}
      <Section className="pt-0">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-16 text-center sm:px-16">
              <div className="pointer-events-none absolute -left-10 -top-16 h-72 w-72 rounded-full bg-pulse/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-lilac-deep/30 blur-3xl" />
              <div className="relative mx-auto max-w-xl">
                <h2 className="text-h2 font-extrabold text-white">
                  Read less. Start a session.
                </h2>
                <p className="mt-4 text-lead text-white/70">
                  Two minutes of setup and you&apos;ll be working next to someone in your subject.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" variant="subtle" className="bg-white text-ink hover:bg-white/90">
                    <Link href="/signup">Create your free account</Link>
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
