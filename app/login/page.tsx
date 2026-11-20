import type { Metadata } from "next"
import Link from "next/link"
import AuthLayout from "@/components/AuthLayout"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your PeerPulse account",
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up your streak where you left it."
      footer={
        <>
          New to PeerPulse?{" "}
          <Link
            href="/signup"
            className="font-semibold text-ink underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
