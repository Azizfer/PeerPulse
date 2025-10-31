"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { User } from "lucide-react"

export function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("")

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const agreeToTerms = formData.get("agreeToTerms")

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions")
      setLoading(false)
      return
    }

    try {
      // TODO: Replace with real signup API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password && firstName && lastName) {
            console.log({ firstName, lastName, email, password })
            resolve(true)
            // Redirect to simplified setup after successful signup
            window.location.href = "/setup/study-info"
          } else {
            reject(new Error("Please fill in all fields"))
          }
        }, 1000)
      })
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Create your account</h1>
        <p className="text-gray-700" style={{ fontSize: '16px', lineHeight: '1.6' }}>Join PeerPulse and enhance your learning</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" type="text" placeholder="John" required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" type="text" placeholder="Doe" required className="h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Profile Photo (Optional)</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                className="hidden"
                id="profile-photo"
              />
              <label htmlFor="profile-photo">
                <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>Choose Photo</span>
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            required
            className="h-12"
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            className="h-12"
            minLength={8}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="agreeToTerms" name="agreeToTerms" required />
          <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
            I agree to the{" "}
            <Link href="/terms" className="text-[#0A0A0A] hover:text-gray-600 transition-colors" style={{ fontWeight: 500 }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#0A0A0A] hover:text-gray-600 transition-colors" style={{ fontWeight: 500 }}>
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button type="submit" disabled={loading} className="relative w-full h-12 bg-[#0A0A0A] text-white rounded-xl overflow-hidden group transition-all duration-300" style={{ fontWeight: 600 }}>
          <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-300">{loading ? "Creating account..." : "Create account"}</span>
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0A0A0A] hover:text-gray-600 font-semibold transition-colors" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
