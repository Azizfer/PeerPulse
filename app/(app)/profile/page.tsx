"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Brain,
  BookOpen,
  GraduationCap,
  UserRound,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit2,
  Flame,
  ListChecks,
  Save,
  Sparkles,
  TimerReset,
  UsersRound,
} from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Avatar } from "@/components/avatar"
import { useToast } from "@/hooks/use-toast"
import { StatsSkeleton, ChartSkeleton } from "@/components/loading-skeleton"
import { NoStatsEmpty } from "@/components/empty-states"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [hasStats] = useState(true) // Toggle this to see empty state
  const [isStreakOpen, setIsStreakOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [activityRange, setActivityRange] = useState<"week" | "month">("week")
  
  const [profileData, setProfileData] = useState({
    // From Sign-up
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    
    // From Setup Step 3 (Academic Info)
    university: "Stanford University",
    major: "Computer Science",
    academicYear: "junior", // freshman/sophomore/junior/senior/graduate
    
    // From Setup Step 2 (Study Goals)
    subjects: ["Mathematics", "Computer Science", "Physics"],
    studyGoal: "Master advanced algorithms, improve problem-solving skills, prepare for technical interviews",
    
    // From Setup Step 1 (Study Preferences)
    preferredStudyTime: "evening", // early-morning/morning/afternoon/evening/night
    
    // From Setup Step 4 (Collaboration)
    collaborationStyle: "small-group", // solo-help/small-group/large-group/flexible
    
    // From Setup Step 5 (Profile)
    bio: "Computer Science student passionate about algorithms and data structures. Looking for study partners to tackle challenging problems together."
  })

  const [savedProfile, setSavedProfile] = useState(profileData)
  const [subjectsDraft, setSubjectsDraft] = useState(profileData.subjects.join(", "))

  // Simulate stats loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingStats(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const updatedProfile = {
      ...profileData,
      subjects: [...new Set(subjectsDraft.split(",").map(subject => subject.trim()).filter(Boolean))],
    }
    setProfileData(updatedProfile)
    setSavedProfile(updatedProfile)
    setIsEditing(false)
    setIsSaving(false)
    toast({
      title: "Profile updated",
      description: "Your changes are applied for this visit.",
      variant: "success"
    })
  }

  const handleCancel = () => {
    setProfileData(savedProfile)
    setSubjectsDraft(savedProfile.subjects.join(", "))
    setIsEditing(false)
  }

  const handleEdit = () => {
    setSavedProfile(profileData)
    setSubjectsDraft(profileData.subjects.join(", "))
    setIsEditing(true)
  }

  // Helper to display proper labels
  const getDisplayLabel = (field: string, value: string) => {
    const labels: Record<string, Record<string, string>> = {
      academicYear: {
        freshman: "Freshman",
        sophomore: "Sophomore",
        junior: "Junior",
        senior: "Senior",
        graduate: "Graduate Student",
        other: "Other"
      },
      preferredStudyTime: {
        "early-morning": "Early Morning (06:00-08:00)",
        morning: "Morning (08:00-12:00)",
        afternoon: "Afternoon (13:00-17:00)",
        evening: "Evening (18:00-22:00)",
        night: "Night (22:00-02:00)"
      },
      collaborationStyle: {
        "solo-help": "Solo with Help",
        "small-group": "Small Groups (2-4)",
        "large-group": "Large Groups (5+)",
        flexible: "Flexible"
      }
    }
    return labels[field]?.[value] || value
  }

  const streakMonth = streakMonths[selectedMonth]
  const streakCalendar = [
    ...Array.from({ length: streakMonth.firstDay }, () => null),
    ...streakMonth.days,
  ]
  const activityMonth = streakMonths[0]
  const activityCalendar = [
    ...Array.from({ length: activityMonth.firstDay }, () => null),
    ...activityMonth.days,
  ]


  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <main className="container-page max-w-5xl py-10 sm:py-14">
          <Tabs defaultValue="profile" className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-[440px] grid-cols-2">
                <TabsTrigger value="profile" className="w-full transition-all duration-200">Profile Details</TabsTrigger>
                <TabsTrigger value="statistics" className="w-full transition-all duration-200">Statistics & Tracking</TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Details Tab */}
            <TabsContent value="profile" className="space-y-7 animate-in fade-in-0 duration-300">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="eyebrow">Your workspace</p>
                  <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[38px]">Profile details</h1>
                  <p className="mt-2 text-[15px] text-ink-soft">A little about you and how you like to learn.</p>
                </div>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" className="gap-2">
                    <Edit2 className="size-3.5" strokeWidth={1.8} /> Edit profile
                  </Button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleCancel} variant="outline" disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} loading={isSaving} variant="accent" className="gap-2">
                      <Save className="size-3.5" strokeWidth={1.8} /> {isSaving ? "Saving…" : "Save changes"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <Card className="overflow-hidden">
                  <div className="h-20 border-b border-line bg-pulse-soft" />
                  <CardContent className="relative px-6 pb-6 pt-0">
                    <div className="-mt-10 mb-4 flex justify-center">
                      <Avatar name={`${profileData.firstName} ${profileData.lastName}`} size="xl" className="rounded-full ring-[6px] ring-surface" />
                    </div>
                    <div className="text-center">
                      <h2 className="break-words font-display text-xl font-extrabold tracking-[-0.025em] text-ink">{profileData.firstName} {profileData.lastName}</h2>
                      <p className="mt-1 text-sm font-medium text-ink-soft">{profileData.major}</p>
                      <p className="mt-1 text-xs text-ink-mute">{profileData.university}</p>
                    </div>
                    <div className="mt-6 space-y-3 border-t border-line pt-5">
                      <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                        <GraduationCap className="size-4 shrink-0 text-ink-mute" strokeWidth={1.8} />
                        {getDisplayLabel("academicYear", profileData.academicYear)}
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                        <Calendar className="size-4 shrink-0 text-ink-mute" strokeWidth={1.8} />
                        Joined December 2023
                      </div>
                    </div>
                    <p className="mt-5 rounded-xl bg-surface-sunken p-3 text-xs leading-5 text-ink-soft">
                      Your subjects and study preferences help peers find the right person to learn with.
                    </p>
                  </CardContent>
                </Card>

                <div className="min-w-0 space-y-5">
                  <ProfileSection icon={UserRound} title="About you" description="Introduce yourself to your next study partner.">
                    {isEditing && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ProfileField label="First name" id="first-name"><Input id="first-name" autoComplete="given-name" value={profileData.firstName} onChange={e => setProfileData(prev => ({ ...prev, firstName: e.target.value }))} /></ProfileField>
                        <ProfileField label="Last name" id="last-name"><Input id="last-name" autoComplete="family-name" value={profileData.lastName} onChange={e => setProfileData(prev => ({ ...prev, lastName: e.target.value }))} /></ProfileField>
                      </div>
                    )}
                    <ProfileField label="Bio" id="bio">
                      {isEditing ? <Textarea id="bio" rows={4} value={profileData.bio} onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value }))} /> : <p className="text-sm leading-7 text-ink-soft">{profileData.bio || "Tell your study partners a little about yourself."}</p>}
                    </ProfileField>
                    <ProfileField label="Email address" id="profile-email">
                      {isEditing ? <Input id="profile-email" type="email" autoComplete="email" value={profileData.email} onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))} /> : <p className="break-all text-sm text-ink">{profileData.email}</p>}
                    </ProfileField>
                  </ProfileSection>

                  <ProfileSection icon={GraduationCap} title="Academic details" description="What you're studying and where.">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <ProfileField label="University" id="university">
                        {isEditing ? <Input id="university" value={profileData.university} onChange={e => setProfileData(prev => ({ ...prev, university: e.target.value }))} /> : <p className="text-sm text-ink">{profileData.university}</p>}
                      </ProfileField>
                      <ProfileField label="Major" id="major">
                        {isEditing ? <Input id="major" value={profileData.major} onChange={e => setProfileData(prev => ({ ...prev, major: e.target.value }))} /> : <p className="text-sm text-ink">{profileData.major}</p>}
                      </ProfileField>
                      <ProfileField label="Academic year" id="academic-year">
                        {isEditing ? <ProfileSelect id="academic-year" value={profileData.academicYear} onChange={value => setProfileData(prev => ({ ...prev, academicYear: value }))} options={["freshman", "sophomore", "junior", "senior", "graduate", "other"].map(value => ({ value, label: getDisplayLabel("academicYear", value) }))} /> : <p className="text-sm text-ink">{getDisplayLabel("academicYear", profileData.academicYear)}</p>}
                      </ProfileField>
                    </div>
                    <ProfileField label="Subjects" id="subjects">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input id="subjects" value={subjectsDraft} onChange={e => setSubjectsDraft(e.target.value)} aria-describedby="subjects-hint" />
                          <p id="subjects-hint" className="text-xs text-ink-mute">Separate subjects with a comma.</p>
                        </div>
                      ) : <div className="flex flex-wrap gap-2">{profileData.subjects.map(subject => <Badge key={subject} variant="secondary" className="font-medium">{subject}</Badge>)}</div>}
                    </ProfileField>
                  </ProfileSection>

                  <ProfileSection icon={BookOpen} title="How you study" description="Help your partners understand what works for you.">
                    <ProfileField label="Study goals" id="study-goals">
                      {isEditing ? <Textarea id="study-goals" rows={3} value={profileData.studyGoal} onChange={e => setProfileData(prev => ({ ...prev, studyGoal: e.target.value }))} /> : <p className="text-sm leading-7 text-ink-soft">{profileData.studyGoal}</p>}
                    </ProfileField>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <ProfileField label="Preferred study time" id="study-time">
                        {isEditing ? <ProfileSelect id="study-time" value={profileData.preferredStudyTime} onChange={value => setProfileData(prev => ({ ...prev, preferredStudyTime: value }))} options={["early-morning", "morning", "afternoon", "evening", "night"].map(value => ({ value, label: getDisplayLabel("preferredStudyTime", value) }))} /> : <p className="text-sm leading-6 text-ink">{getDisplayLabel("preferredStudyTime", profileData.preferredStudyTime)}</p>}
                      </ProfileField>
                      <ProfileField label="Study style" id="study-style">
                        {isEditing ? <ProfileSelect id="study-style" value={profileData.collaborationStyle} onChange={value => setProfileData(prev => ({ ...prev, collaborationStyle: value }))} options={["solo-help", "small-group", "large-group", "flexible"].map(value => ({ value, label: getDisplayLabel("collaborationStyle", value) }))} /> : <p className="text-sm leading-6 text-ink">{getDisplayLabel("collaborationStyle", profileData.collaborationStyle)}</p>}
                      </ProfileField>
                    </div>
                  </ProfileSection>
                </div>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="text-center sm:text-left">
                <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink">Statistics & Tracking</h1>
                <p className="mt-1.5 text-[15px] text-ink-soft">Monitor your study habits and progress with detailed insights</p>
              </div>

              {isLoadingStats ? (
                <div className="space-y-6">
                  <StatsSkeleton />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <ChartSkeleton />
                  </div>
                  <ChartSkeleton />
                </div>
              ) : !hasStats ? (
                <NoStatsEmpty />
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryStats.map((stat) => {
                      const Icon = stat.icon
                      const card = (
                        <Card className="h-full border-line transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card">
                          <CardContent className="grid min-h-[112px] grid-cols-[40px_1fr] items-center gap-4 p-5">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-sunken text-pulse-dark">
                              <Icon className="size-[18px]" strokeWidth={1.8} />
                            </span>
                            <span className="grid min-w-0 grid-rows-[40px_32px]">
                              <span className="flex items-start text-sm font-medium leading-5 text-ink-soft">{stat.label}</span>
                              <span className="flex items-end font-display text-[30px] font-extrabold leading-none tracking-[-0.04em] text-ink tabular-nums">{stat.value}</span>
                            </span>
                          </CardContent>
                        </Card>
                      )

                      return stat.opensStreak ? (
                        <button
                          key={stat.label}
                          type="button"
                          className="h-full rounded-3xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse focus-visible:ring-offset-2"
                          onClick={() => setIsStreakOpen(true)}
                          aria-label="Open monthly study streak"
                        >
                          {card}
                        </button>
                      ) : (
                        <div key={stat.label} className="h-full">{card}</div>
                      )
                    })}
                  </div>
                  
                  {/* Community Activity Stats */}
                  <Card className="border-line transition-all duration-200 hover:shadow-card">
                    <CardHeader className="pb-4">
                      <CardTitle>Community Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid overflow-hidden rounded-2xl border border-line bg-surface-sunken sm:grid-cols-3">
                        {communityStats.map(({ label, value, icon: Icon }, index) => (
                          <div
                            key={label}
                            className={`grid min-h-[104px] grid-cols-[36px_1fr] items-center gap-3 px-5 py-4 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}
                          >
                            <span className="grid size-9 place-items-center rounded-xl bg-surface text-pulse-dark shadow-soft">
                              <Icon className="size-4" strokeWidth={1.8} />
                            </span>
                            <div>
                              <p className="min-h-10 text-sm font-medium leading-5 text-ink-soft">{label}</p>
                              <p className="font-display text-[28px] font-extrabold leading-none tracking-[-0.04em] text-ink tabular-nums">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
                    <Card className="border-line transition-all duration-200 hover:shadow-card">
                      <CardHeader className="gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                        <div>
                          <CardTitle>Study activity</CardTitle>
                          <p className="mt-1 text-sm text-ink-soft">Your real focused time, not an estimated trend.</p>
                        </div>
                        <div className="inline-grid grid-cols-2 rounded-full border border-line bg-surface-sunken p-1">
                          {(["week", "month"] as const).map((range) => (
                            <button
                              key={range}
                              type="button"
                              onClick={() => setActivityRange(range)}
                              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${activityRange === range ? "bg-surface text-ink shadow-soft" : "text-ink-mute hover:text-ink"}`}
                            >
                              {range === "week" ? "This week" : "This month"}
                            </button>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {activityRange === "week" ? (
                          <div className="space-y-5">
                            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-surface-sunken">
                              {[
                                { label: "Total", value: "26h" },
                                { label: "Daily average", value: "3.7h" },
                                { label: "Strongest day", value: "Tue" },
                              ].map(({ label, value }, index) => (
                                <div key={label} className={`px-3 py-3.5 text-center ${index > 0 ? "border-l border-line" : ""}`}>
                                  <p className="font-display text-lg font-extrabold text-ink tabular-nums">{value}</p>
                                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-mute">{label}</p>
                                </div>
                              ))}
                            </div>
                            <div className="grid h-44 grid-cols-7 items-end gap-2">
                              {weeklyData.map(({ label, hours, height }) => (
                                <div key={label} className="flex h-full flex-col items-center justify-end gap-2">
                                  <span className="text-xs font-bold text-ink tabular-nums">{hours}h</span>
                                  <div className="flex h-24 w-full items-end rounded-xl bg-surface-sunken p-1">
                                    <div className="w-full rounded-lg bg-pulse transition-all duration-500" style={{ height }} />
                                  </div>
                                  <span className="text-xs font-semibold text-ink-soft">{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-line bg-surface-sunken px-4 py-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-mute">November 2026</p>
                                <p className="mt-1 font-display text-2xl font-extrabold text-ink tabular-nums">31.5 hours</p>
                              </div>
                              <button type="button" onClick={() => setIsStreakOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-pulse-dark hover:text-pulse">
                                Full streak history <ChevronRight className="size-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
                              {weekDays.map((day, index) => <span key={`${day}-activity-${index}`}>{day}</span>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                              {activityCalendar.map((minutes, index) => {
                                if (minutes === null) return <span key={`activity-empty-${index}`} className="min-h-14" />
                                const day = index - activityMonth.firstDay + 1
                                return (
                                  <div key={day} className={`flex min-h-14 flex-col items-center justify-center rounded-xl border ${minutes === 0 ? "border-line bg-surface-sunken text-ink-mute" : "border-pulse/20 bg-pulse-soft text-ink"}`}>
                                    <span className="text-[10px] font-semibold text-ink-mute">{day}</span>
                                    <span className="mt-0.5 text-[11px] font-bold tabular-nums">{formatHours(minutes)}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-line transition-all duration-200 hover:shadow-card">
                      <CardHeader className="pb-4">
                        <CardTitle>Focus patterns</CardTitle>
                        <p className="text-sm text-ink-soft">Insights that can improve your next session.</p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {focusPatterns.map(({ label, value, detail, icon: Icon }) => (
                          <div key={label} className="grid grid-cols-[36px_1fr] items-center gap-3 rounded-2xl border border-line bg-surface-sunken px-3.5 py-3">
                            <span className="grid size-9 place-items-center rounded-xl bg-surface text-pulse-dark shadow-soft">
                              <Icon className="size-4" strokeWidth={1.8} />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">{label}</p>
                              <p className="mt-0.5 font-display text-base font-extrabold text-ink">{value}</p>
                              <p className="mt-0.5 text-xs leading-4 text-ink-soft">{detail}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <Drawer open={isStreakOpen} onOpenChange={setIsStreakOpen}>
            <DrawerContent>
              <DrawerHeader>
                <div className="mb-2 grid size-9 place-items-center rounded-xl bg-pulse-soft text-pulse-dark">
                  <Flame className="size-4" strokeWidth={1.8} />
                </div>
                <DrawerTitle className="font-display text-xl font-bold tracking-tight text-ink">
                  Study streak
                </DrawerTitle>
                <DrawerDescription className="text-ink-soft">
                  See how consistently you showed up, month by month.
                </DrawerDescription>
              </DrawerHeader>

              <DrawerBody>
                <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-2 shadow-soft">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMonth((month) => Math.min(month + 1, streakMonths.length - 1))}
                    disabled={selectedMonth === streakMonths.length - 1}
                    aria-label="Show previous month"
                    className="rounded-xl"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <div className="text-center">
                    <p className="font-display text-base font-bold text-ink">{streakMonth.label}</p>
                    <p className="text-xs text-ink-mute">{streakMonth.activeDays} active days</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMonth((month) => Math.max(month - 1, 0))}
                    disabled={selectedMonth === 0}
                    aria-label="Show next month"
                    className="rounded-xl"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-surface">
                  {[
                    { label: "Current", value: `${streakMonth.currentStreak}d` },
                    { label: "Best", value: `${streakMonth.bestStreak}d` },
                    { label: "Focused", value: `${streakMonth.hours}h` },
                  ].map(({ label, value }, index) => (
                    <div key={label} className={`px-3 py-4 text-center ${index > 0 ? "border-l border-line" : ""}`}>
                      <p className="font-display text-xl font-extrabold text-ink tabular-nums">{value}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-mute">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
                  <div className="mb-4 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
                    {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {streakCalendar.map((minutes, index) => {
                      if (minutes === null) return <span key={`empty-${index}`} className="aspect-square" />
                      const day = index - streakMonth.firstDay + 1
                      const intensity = minutes === 0 ? "bg-surface-sunken text-ink-mute" : minutes < 45 ? "bg-pulse/15 text-pulse-dark" : minutes < 90 ? "bg-pulse/35 text-ink" : "bg-pulse text-white"
                      return (
                        <div
                          key={day}
                          title={`${minutes} focused minutes`}
                          className={`flex aspect-square flex-col items-center justify-center rounded-xl font-semibold tabular-nums ${intensity}`}
                        >
                          <span className="text-[10px] opacity-75">{day}</span>
                          <span className="mt-0.5 text-[11px]">{formatHours(minutes)}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-ink-mute">
                    <span>Less focused</span>
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="size-3 rounded bg-surface-sunken" />
                      <span className="size-3 rounded bg-pulse/15" />
                      <span className="size-3 rounded bg-pulse/35" />
                      <span className="size-3 rounded bg-pulse" />
                    </div>
                    <span>More focused</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface-sunken p-4">
                  <div className="flex items-start gap-3">
                    <Activity className="mt-0.5 size-4 shrink-0 text-pulse-dark" />
                    <p className="text-sm leading-6 text-ink-soft">{streakMonth.insight}</p>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild><Button variant="outline" className="h-10 w-full">Done</Button></DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </main>
      </div>
    </PageTransition>
  )
}

function ProfileSection({ icon: Icon, title, description, children }: {
  icon: typeof BookOpen
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0 border-b border-line px-5 py-5 sm:px-6">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-sunken text-pulse-dark">
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="mt-1 text-xs leading-5 text-ink-soft">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">{children}</CardContent>
    </Card>
  )
}

function ProfileField({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="block text-xs font-medium text-ink-mute">{label}</Label>
      {children}
    </div>
  )
}

function ProfileSelect({ id, value, onChange, options }: {
  id: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <CustomSelect id={id} value={value} onChange={onChange} options={options} />
  )
}

// Static data for statistics
const summaryStats = [
  {
    label: "Focused Hours",
    value: "125",
    icon: TimerReset,
    opensStreak: false,
  },
  {
    label: "Study Session Streak",
    value: "28",
    icon: Flame,
    opensStreak: true,
  },
  {
    label: "Study Partners",
    value: "15",
    icon: UsersRound,
    opensStreak: false,
  },
  {
    label: "Tasks Completed",
    value: "350",
    icon: ListChecks,
    opensStreak: false,
  },
]

const communityStats = [
  { label: "Communities Joined", value: "3", icon: UsersRound },
  { label: "Posts This Week", value: "8", icon: Activity },
  { label: "Likes Received", value: "156", icon: Flame },
]

const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

const streakMonths = [
  {
    label: "November 2026",
    firstDay: 0,
    activeDays: 22,
    currentStreak: 8,
    bestStreak: 12,
    hours: 31.5,
    days: [45, 90, 70, 0, 30, 110, 55, 80, 65, 0, 95, 40, 75, 120, 50, 85, 0, 60, 100, 35, 90, 70, 0, 45, 105, 65, 80, 0, 55, 95],
    insight: "You are most consistent from Tuesday to Thursday. Your longest break this month was two days.",
  },
  {
    label: "October 2026",
    firstDay: 4,
    activeDays: 25,
    currentStreak: 0,
    bestStreak: 9,
    hours: 38,
    days: [60, 45, 100, 85, 0, 70, 90, 40, 115, 75, 55, 0, 95, 80, 65, 120, 45, 0, 90, 50, 75, 105, 60, 35, 0, 110, 85, 70, 50, 95, 65],
    insight: "October was your strongest month for total focus time, with a nine-day streak in the middle of the month.",
  },
  {
    label: "September 2026",
    firstDay: 2,
    activeDays: 19,
    currentStreak: 0,
    bestStreak: 7,
    hours: 26,
    days: [0, 50, 75, 40, 90, 0, 60, 110, 45, 0, 80, 65, 95, 35, 0, 70, 100, 55, 85, 0, 45, 75, 120, 60, 0, 90, 50, 70, 0, 100],
    insight: "You built momentum during the second half of September and carried it into October.",
  },
]

const weeklyData = [
  { label: "Mon", hours: 2, height: "20%" },
  { label: "Tue", hours: 8, height: "100%" },
  { label: "Wed", hours: 6, height: "75%" },
  { label: "Thu", hours: 3, height: "37%" },
  { label: "Fri", hours: 1, height: "12%" },
  { label: "Sat", hours: 4, height: "50%" },
  { label: "Sun", hours: 2, height: "25%" }
]

const focusPatterns = [
  { label: "Strongest day", value: "Tuesday", detail: "8 focused hours this week", icon: Sparkles },
  { label: "Best study window", value: "7–9 PM", detail: "Your most consistent time", icon: Clock3 },
  { label: "Average session", value: "52 min", detail: "Up 6 minutes from last month", icon: Brain },
  { label: "Goal completion", value: "84%", detail: "21 of 25 goals completed", icon: CheckCircle2 },
]

function formatHours(minutes: number) {
  if (minutes === 0) return "—"
  const hours = minutes / 60
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`
}
