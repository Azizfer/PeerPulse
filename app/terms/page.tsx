import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { type LegalSection } from "@/components/LegalPage"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using PeerPulse.",
}

const SECTIONS: LegalSection[] = [
  {
    heading: "Acceptance of terms",
    body: "By accessing and using PeerPulse, you accept and agree to be bound by these terms. If you don't agree with them, don't use the service.",
  },
  {
    heading: "Use licence",
    body: "PeerPulse is granted to you for personal, non-commercial study purposes. You may not resell it, scrape it, or use it to build a competing service.",
  },
  {
    heading: "User conduct",
    body: (
      <>
        <p>
          You agree to use PeerPulse respectfully and not to harass, abuse, record or harm other
          users. Sessions are live and unrecorded — recording someone without their consent is a
          violation and will get your account removed.
        </p>
        <ul className="mt-3 space-y-1.5">
          {[
            "No recording, screenshotting or rebroadcasting of sessions",
            "No harassment, hate speech or sexual content",
            "No spam, advertising or recruiting in communities",
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
    heading: "Accounts",
    body: "You're responsible for keeping your login secure and for anything that happens under your account. You must be at least 16 years old to use PeerPulse.",
  },
  {
    heading: "Subscriptions",
    body: "Premium is billed monthly or yearly in advance. You can cancel at any time and keep access until the end of the billing period. Refunds are handled case by case.",
  },
  {
    heading: "Termination",
    body: "We may suspend or terminate access immediately, without prior notice, for conduct we believe violates these terms or puts other members at risk.",
  },
  {
    heading: "Liability",
    body: "PeerPulse is provided as is. We're not liable for grades, missed deadlines or anything else that follows from using (or not using) the service.",
  },
  {
    heading: "Contact",
    body: (
      <>
        Questions about these terms? Reach us through the{" "}
        <Link href="/contact" className="font-medium text-ink underline underline-offset-4">
          contact page
        </Link>
        .
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="The short version: be decent to the other people in the room, don't record them, and don't use this to sell things."
      sections={SECTIONS}
    />
  )
}
