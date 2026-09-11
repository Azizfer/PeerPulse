"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Bell, BookOpen, Lock, Trash2 } from "lucide-react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CustomSelect } from "@/components/ui/custom-select"
import { Reveal } from "@/components/reveal"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  const [notifications, setNotifications] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [defaultSessionLength, setDefaultSessionLength] = useState("25")
  const [autoMatchmaking, setAutoMatchmaking] = useState(true)

  const saved = (title: string, description: string) =>
    toast({ title, description, variant: "success" })

  const handleDeleteAccount = () => {
    if (confirm("Delete your account? This can't be undone.")) {
      toast({
        title: "Account deletion requested",
        description: "We've emailed you a confirmation link.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container-page max-w-3xl py-10 sm:py-14">
        <Reveal>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 font-display text-[34px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[40px]">
            Settings
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            How PeerPulse notifies you, who can find you, and how your sessions run.
          </p>
        </Reveal>

        <div className="mt-10 space-y-5">
          {/* ---------------- Notifications ---------------- */}
          <Reveal delay={0.05}>
            <SettingsCard icon={<Bell className="h-5 w-5" />} title="Notifications">
              <ToggleRow
                label="Enable notifications"
                hint="Messages, replies and session invites"
                checked={notifications}
                onChange={setNotifications}
              />
              <ToggleRow
                label="Session reminders"
                hint="A nudge ten minutes before a booked session"
                checked={studyReminders}
                onChange={setStudyReminders}
              />
              <SaveButton
                onClick={() =>
                  saved("Notifications saved", "Your notification preferences are updated.")
                }
              >
                Save notifications
              </SaveButton>
            </SettingsCard>
          </Reveal>

          {/* ---------------- Privacy ---------------- */}
          <Reveal delay={0.1}>
            <SettingsCard icon={<Lock className="h-5 w-5" />} title="Privacy">
              <div className="border-b border-line py-4 last:border-b-0">
                <label className="mb-2 block text-[14px] font-medium text-ink-soft">
                  Who can see your profile
                </label>
                <CustomSelect
                  value={profileVisibility}
                  onChange={setProfileVisibility}
                  options={[
                    { value: "public", label: "Everyone" },
                    { value: "students", label: "Verified students only" },
                    { value: "private", label: "Study partners only" },
                  ]}
                />
              </div>
              <ToggleRow
                label="Show when I'm online"
                hint="Lets peers see you're available right now"
                checked={showOnlineStatus}
                onChange={setShowOnlineStatus}
              />
              <SaveButton
                onClick={() => saved("Privacy saved", "Your privacy preferences are updated.")}
              >
                Save privacy
              </SaveButton>
            </SettingsCard>
          </Reveal>

          {/* ---------------- Study preferences ---------------- */}
          <Reveal delay={0.15}>
            <SettingsCard icon={<BookOpen className="h-5 w-5" />} title="Study preferences">
              <div className="border-b border-line py-4 last:border-b-0">
                <label className="mb-2 block text-[14px] font-medium text-ink-soft">
                  Default session length
                </label>
                <CustomSelect
                  value={defaultSessionLength}
                  onChange={setDefaultSessionLength}
                  options={[
                    { value: "25", label: "25 minutes (Pomodoro)" },
                    { value: "45", label: "45 minutes" },
                    { value: "60", label: "1 hour" },
                    { value: "90", label: "1.5 hours" },
                  ]}
                />
              </div>
              <ToggleRow
                label="Match me automatically"
                hint="Pair with students on the same topics without asking"
                checked={autoMatchmaking}
                onChange={setAutoMatchmaking}
              />
              <SaveButton
                onClick={() =>
                  saved("Preferences saved", "Your study preferences are updated.")
                }
              >
                Save preferences
              </SaveButton>
            </SettingsCard>
          </Reveal>

          {/* ---------------- Danger zone ---------------- */}
          <Reveal delay={0.2}>
            <section className="rounded-3xl border border-rose bg-rose/25 p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface text-rose-deep">
                  <Trash2 className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-rose-deep">
                  Danger zone
                </h2>
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-rose-deep/80">
                Deleting your account removes your sessions, goals and posts. It can&apos;t be
                undone.
              </p>
              <Button variant="destructive" className="mt-5" onClick={handleDeleteAccount}>
                Delete account
              </Button>
            </section>
          </Reveal>
        </div>
      </main>
    </div>
  )
}

function SettingsCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-line bg-surface px-6 shadow-soft sm:px-7">
      <div className="flex items-center gap-3 border-b border-line py-5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-sunken text-ink-soft">
          {icon}
        </span>
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[14.5px] font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-[13px] text-ink-mute">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function SaveButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <div className="border-t border-line py-4">
      <Button onClick={onClick}>{children}</Button>
    </div>
  )
}
