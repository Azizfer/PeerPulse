"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      router.push("/") // Redirect to homepage which will show dashboard
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Welcome back</h1>
        <p className="text-gray-700" style={{ fontSize: '16px', lineHeight: '1.6' }}>Sign in to your PeerPulse account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Enter your email" required className="h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="h-12"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:outline-none"
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-[#0A0A0A] hover:text-gray-600 transition-colors" style={{ fontWeight: 500 }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="relative w-full h-12 bg-[#0A0A0A] text-white rounded-xl overflow-hidden group transition-all duration-300" style={{ fontWeight: 600 }}>
          <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-300">{loading ? "Signing in..." : "Sign in"}</span>
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-700">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#0A0A0A] hover:text-gray-600 font-semibold transition-colors" style={{ fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
