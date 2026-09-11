import type { Metadata } from "next"
import OnboardingLayout from "@/components/OnboardingLayout"
import { StudyInfoForm } from "./study-info-form"

export const metadata: Metadata = {
  title: "What are you studying?",
  description: "Set up the subjects and goals PeerPulse will match you on.",
}

export default function StudyInfoPage() {
  return (
    <OnboardingLayout
      step={1}
      title="What are you studying?"
      subtitle="This is what we match you on — the more specific, the better the pairing."
      backHref="/signup"
    >
      <StudyInfoForm />
    </OnboardingLayout>
  )
}
