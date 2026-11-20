import type { Metadata } from "next"
import OnboardingLayout from "@/components/OnboardingLayout"
import { AcademicInfoFormSimple } from "./academic-info-form-simple"

export const metadata: Metadata = {
  title: "Academic background",
  description: "Tell us where and what you study.",
}

export default function AcademicInfoPage() {
  return (
    <OnboardingLayout
      step={2}
      title="Academic background"
      subtitle="So we can put you in rooms with people at the same stage, not three years ahead."
      backHref="/setup/study-info"
    >
      <AcademicInfoFormSimple />
    </OnboardingLayout>
  )
}
