import type { Metadata } from "next"
import Link from "next/link"
import AuthLayout from "@/components/AuthLayout"
import { SignupForm } from "./signup-form"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your PeerPulse account and get matched with study partners",
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Two minutes of setup, then you can be in a focus room tonight."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ink underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  )
}
