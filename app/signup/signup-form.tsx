"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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
      reader.onloadend = () => setProfilePhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const agreeToTerms = formData.get("agreeToTerms")

    if (password !== confirmPassword) {
      setError("Those passwords don't match.")
      setLoading(false)
      return
    }
    if (!agreeToTerms) {
      setError("Please accept the terms to continue.")
      setLoading(false)
      return
    }

    try {
      // TODO: replace with the real signup call once the backend is wired up.
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password && firstName && lastName) {
            console.log({ firstName, lastName, email, profilePhoto })
            resolve(true)
            window.location.href = "/setup/study-info"
          } else {
            reject(new Error("Please fill in all fields"))
          }
        }, 1000)
      })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-rose bg-rose/40 px-4 py-3 text-sm text-rose-deep">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" placeholder="Sana" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" placeholder="Benali" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">University email</Label>
        <Input id="email" name="email" type="email" placeholder="you@university.edu" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Type it again"
          required
          minLength={8}
        />
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-sunken">
          {profilePhotoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profilePhotoPreview} alt="" className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-ink-faint" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoUpload}
            className="hidden"
            id="profile-photo"
          />
          <label htmlFor="profile-photo" className="cursor-pointer">
            <Button type="button" variant="secondary" size="sm" asChild>
              <span>Upload photo</span>
            </Button>
          </label>
          <p className="mt-1.5 text-[12.5px] text-ink-mute">Optional · JPG or PNG, up to 5 MB</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox id="agreeToTerms" name="agreeToTerms" className="mt-0.5" required />
        <Label htmlFor="agreeToTerms" className="text-[13.5px] leading-relaxed text-ink-soft">
          I agree to the{" "}
          <Link href="/terms" className="font-medium text-ink underline-offset-4 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-ink underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
