"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { Bell, Lock, Eye, EyeOff, Globe, Clock, BookOpen, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CustomSelect } from "@/components/ui/custom-select"

export default function SettingsPage() {
  const { toast } = useToast()

  // Notification preferences
  const [notifications, setNotifications] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)

  // Study preferences
  const [defaultSessionLength, setDefaultSessionLength] = useState("25")
  const [autoMatchmaking, setAutoMatchmaking] = useState(true)

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved! ✓",
      description: "Your notification preferences have been updated.",
      variant: "success"
    })
  }

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Saved! ✓",
      description: "Your privacy preferences have been updated.",
      variant: "success"
    })
  }

  const handleSaveStudyPreferences = () => {
    toast({
      title: "Study Preferences Saved! ✓",
      description: "Your study preferences have been updated.",
      variant: "success"
    })
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted.",
        variant: "success"
      })
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f5f1e8] font-[Lexend,_'Noto_Sans',_sans-serif]">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Settings</h1>
          <p className="text-ink-soft mb-8">Manage your app preferences and account settings</p>

          {/* Notification Settings */}
          <Card className="mb-6 border border-line-strong hover:border-ink-faint hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-pulse-dark" />
                <h2 className="text-xl font-semibold text-ink">Notification Preferences</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-ink">Enable Notifications</span>
                  <p className="text-xs text-ink-mute mt-0.5">Receive updates about messages and sessions</p>
                </div>
                <div className="relative inline-block w-11 h-6 ml-4">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-pulse transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-surface rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-ink">Study Session Reminders</span>
                  <p className="text-xs text-ink-mute mt-0.5">Get notified before your scheduled sessions</p>
                </div>
                <div className="relative inline-block w-11 h-6 ml-4">
                  <input
                    type="checkbox"
                    checked={studyReminders}
                    onChange={(e) => setStudyReminders(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-pulse transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-surface rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
              </label>

              <Button onClick={handleSaveNotifications} className="w-full sm:w-auto">
                Save Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="mb-6 border border-line-strong hover:border-ink-faint hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-pulse-dark" />
                <h2 className="text-xl font-semibold text-ink">Privacy Settings</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Who can see your profile</label>
                <CustomSelect
                  value={profileVisibility}
                  onChange={setProfileVisibility}
                  options={[
                    { value: "public", label: "Everyone" },
                    { value: "students", label: "Students only" },
                    { value: "private", label: "Study partners only" },
                  ]}
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-ink">Show when I'm online</span>
                  <p className="text-xs text-ink-mute mt-0.5">Let others see your online status</p>
                </div>
                <div className="relative inline-block w-11 h-6 ml-4">
                  <input
                    type="checkbox"
                    checked={showOnlineStatus}
                    onChange={(e) => setShowOnlineStatus(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-pulse transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-surface rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
              </label>

              <Button onClick={handleSavePrivacy} className="w-full sm:w-auto">
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card className="mb-6 border border-line-strong hover:border-ink-faint hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-pulse-dark" />
                <h2 className="text-xl font-semibold text-ink">Study Preferences</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Preferred session length</label>
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

              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-ink">Find study partners automatically</span>
                  <p className="text-xs text-ink-mute mt-0.5">Match with students studying similar topics</p>
                </div>
                <div className="relative inline-block w-11 h-6 ml-4">
                  <input
                    type="checkbox"
                    checked={autoMatchmaking}
                    onChange={(e) => setAutoMatchmaking(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-pulse transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-surface rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
              </label>

              <Button onClick={handleSaveStudyPreferences} className="w-full sm:w-auto">
                Save Study Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-300 hover:border-red-400 hover:shadow-lg transition-all duration-200 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink-soft mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  )
}
