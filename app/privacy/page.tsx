import type { Metadata } from "next"
import LegalPage, { type LegalSection } from "@/components/LegalPage"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What PeerPulse collects, what it doesn't, and what happens to your data.",
}

const SECTIONS: LegalSection[] = [
  {
    heading: "What we collect",
    body: (
      <>
        <p className="mb-3">Information you give us directly:</p>
        <ul className="space-y-1.5">
          {[
            "Name and university email address",
            "Profile details — university, programme, subjects, study preferences",
            "Session data — goals, duration, who you studied with",
            "Anything you post in a community",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: "How we use it",
    body: (
      <>
        <p className="mb-3">We use what we collect to:</p>
        <ul className="space-y-1.5">
          {[
            "Match you with people studying the same subjects",
            "Run and improve the service",
            "Send you the notifications you asked for (session reminders, replies)",
            "Understand which features are actually used",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">We don't sell your data, and we don't run third-party ad trackers.</p>
      </>
    ),
  },
  {
    heading: "Video and audio",
    body: "Media in a focus room is peer-to-peer or relayed through our media servers, encrypted in transit, and never written to disk. We store only session metadata: who, when, and how long.",
  },
  {
    heading: "AI features",
    body: "When you use Pulse, the relevant part of your question, goals or uploaded resources is sent to our model provider to generate an answer. It isn't used to train their models. You can turn AI features off in settings.",
  },
  {
    heading: "Data security",
    body: "We use encryption in transit and at rest, scoped database access, and regular reviews. No method of transmission over the internet is completely secure, but we take this seriously.",
  },
  {
    heading: "Your rights",
    body: "You can access, correct, export or delete your personal information at any time from account settings, or by asking us. Deletion is permanent within 30 days.",
  },
  {
    heading: "Changes to this policy",
    body: "If we change something meaningful, we'll tell you in the app and by email before it takes effect.",
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="The short version: we collect what's needed to match you, we don't record your sessions, and we never sell your data."
      sections={SECTIONS}
    />
  )
}
