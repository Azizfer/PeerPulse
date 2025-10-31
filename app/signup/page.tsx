import type { Metadata } from "next"
import Header from "@/components/Header"
import { SignupForm } from "./signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your PeerPulse account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[32px] shadow-2xl border border-gray-200 p-8 md:p-10">
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  )
}
