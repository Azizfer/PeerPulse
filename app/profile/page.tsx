"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Calendar, BookOpen, Clock, Users, Target, TrendingUp, Award, Edit2, Save, X } from 'lucide-react'
import { Avatar } from "@/components/avatar"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { StatsSkeleton, ChartSkeleton } from "@/components/loading-skeleton"
import { NoStatsEmpty } from "@/components/empty-states"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [hasStats] = useState(true) // Toggle this to see empty state
  
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

  // Simulate stats loading
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoadingStats(false)
    }, 2000)
    return () => clearTimeout(timer)
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsEditing(false)
    setIsSaving(false)
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile information has been saved successfully.",
      variant: "success"
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleEdit = () => {
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


  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <Header />

        <main className="container-page max-w-5xl py-10 sm:py-14">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="profile" className="transition-all duration-200">Profile Details</TabsTrigger>
              <TabsTrigger value="statistics" className="transition-all duration-200">Statistics & Tracking</TabsTrigger>
            </TabsList>

            {/* Profile Details Tab */}
            <TabsContent value="profile" className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink">Profile details</h1>
                  <p className="mt-1.5 text-[15px] text-ink-soft">{isEditing ? "Edit your profile information" : "Your public profile information"}</p>
                </div>
                {!isEditing ? (
                  <Button onClick={handleEdit}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} loading={isSaving} variant="accent">
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="border-line lg:col-span-1 transition-all duration-200 hover:shadow-card">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <Avatar name={`${profileData.firstName} ${profileData.lastName}`} size="xl" />
                    </div>
                    <CardTitle className="text-xl">
                      {profileData.firstName} {profileData.lastName}
                    </CardTitle>
                    <p className="text-ink-soft">{profileData.major} • {getDisplayLabel('academicYear', profileData.academicYear)}</p>
                    <p className="text-sm text-ink-mute">{profileData.university}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-ink-soft">
                      <Mail className="w-4 h-4" />
                      {profileData.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-soft">
                      <Calendar className="w-4 h-4" />
                      Joined December 2023
                    </div>
                    <div>
                      <h4 className="font-medium text-ink mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-1">
                        {profileData.subjects.map((subject) => (
                          <Badge key={subject} variant="lilac">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Details Card */}
                <Card className="border-line lg:col-span-2 transition-all duration-200 hover:shadow-card">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Name Fields */}
                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          <Input
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <Input
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    <div>
                      <Label className="text-sm font-medium text-ink-mute mb-2">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-ink mt-2">{profileData.bio}</p>
                      )}
                    </div>

                    {/* Email & Academic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-ink-mute mb-2">Academic Year</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.academicYear}
                            onChange={(e) => setProfileData(prev => ({ ...prev, academicYear: e.target.value }))}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-ink mt-2">{getDisplayLabel('academicYear', profileData.academicYear)}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-ink-mute mb-2">Email</Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-ink mt-2">{profileData.email}</p>
                        )}
                      </div>
                    </div>

                    {/* University & Major */}
                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>University</Label>
                          <Input
                            value={profileData.university}
                            onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Major</Label>
                          <Input
                            value={profileData.major}
                            onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}

                    {/* Study Subjects */}
                    <div>
                      <Label className="text-sm font-medium text-ink-mute mb-3">Study Subjects</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.subjects.map((subject) => (
                          <Badge key={subject} variant="lilac">{subject}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Study Goals */}
                    <div>
                      <Label className="text-sm font-medium text-ink-mute mb-2">Study Goals</Label>
                      {isEditing ? (
                        <Textarea
                          value={profileData.studyGoal}
                          onChange={(e) => setProfileData(prev => ({ ...prev, studyGoal: e.target.value }))}
                          rows={2}
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-ink mt-2">{profileData.studyGoal}</p>
                      )}
                    </div>

                    {/* Study Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-ink-mute mb-2">Preferred Study Time</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.preferredStudyTime}
                            onChange={(e) => setProfileData(prev => ({ ...prev, preferredStudyTime: e.target.value }))}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-ink mt-2">{getDisplayLabel('preferredStudyTime', profileData.preferredStudyTime)}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-ink-mute mb-2">Study Style</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.collaborationStyle}
                            onChange={(e) => setProfileData(prev => ({ ...prev, collaborationStyle: e.target.value }))}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-ink mt-2">{getDisplayLabel('collaborationStyle', profileData.collaborationStyle)}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-3xl font-bold text-ink">Statistics & Tracking</h1>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryStats.map((stat, index) => (
                      <Card key={stat.label} className="border-line transition-all duration-200 hover:shadow-card">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-surface-sunken p-2">
                              <div className="text-pulse-dark">{stat.icon}</div>
                            </div>
                            <div>
                              <p className="text-sm text-ink-soft">{stat.label}</p>
                              <p className="font-display text-[28px] font-extrabold leading-none tracking-[-0.04em] text-ink tabular-nums">{stat.value}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Community Activity Stats */}
                  <Card className="border-line transition-all duration-200 hover:shadow-card">
                    <CardHeader>
                      <CardTitle>Community Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm text-ink-soft">Communities Joined</p>
                          <p className="font-display text-[28px] font-extrabold leading-none tracking-[-0.04em] text-ink tabular-nums">3</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-ink-soft">Posts This Week</p>
                          <p className="font-display text-[28px] font-extrabold leading-none tracking-[-0.04em] text-ink tabular-nums">8</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-ink-soft">Likes Received</p>
                          <p className="font-display text-[28px] font-extrabold leading-none tracking-[-0.04em] text-ink tabular-nums">156</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Study Hours */}
                    <Card className="border-line transition-all duration-200 hover:shadow-card">
                      <CardHeader>
                        <CardTitle>Weekly Study Hours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-2 items-end h-40">
                          {weeklyData.map(({ label, hours, height }, index) => (
                            <div key={label} className="flex flex-col items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                              <div
                                className="w-full cursor-pointer rounded-t bg-pulse/70 transition-colors duration-200 hover:bg-pulse"
                                style={{ height }}
                              />
                              <span className="text-xs text-ink-soft font-medium">{label}</span>
                              <span className="text-xs text-ink-mute">{hours}h</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Study Partners by Subject */}
                    <Card className="border-line transition-all duration-200 hover:shadow-card">
                      <CardHeader>
                        <CardTitle>Study Partners by Subject</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {subjectData.map(({ name, partners, percentage }, index) => (
                            <div key={name} className="space-y-2 animate-in fade-in-0 slide-in-from-left-4" style={{ animationDelay: `${index * 150}ms` }}>
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-ink-soft">{name}</span>
                                <span className="text-ink-mute">{partners} partners</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-line">
                                <div
                                  className="h-2 rounded-full bg-pulse transition-all duration-1000 ease-out hover:bg-pulse-dark"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Study Session Streaks */}
                  <Card className="border border-line-strong hover:border-ink-faint hover:shadow-lg transition-all duration-200 shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
                    <CardHeader>
                      <CardTitle>Monthly Study Streaks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-end justify-between gap-1">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 400 160"
                          className="overflow-visible"
                        >
                          <defs>
                            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          
                          {/* Area under curve */}
                          <path
                            d="M0 120 L50 80 L100 100 L150 60 L200 90 L250 40 L300 70 L350 30 L400 50 L400 160 L0 160 Z"
                            fill="url(#streakGradient)"
                            className="animate-in fade-in-0 duration-1000 delay-500"
                          />
                          
                          {/* Line */}
                          <path
                            d="M0 120 L50 80 L100 100 L150 60 L200 90 L250 40 L300 70 L350 30 L400 50"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-in fade-in-0 duration-1000 delay-700"
                            style={{
                              strokeDasharray: "1000",
                              strokeDashoffset: "1000",
                              animation: "drawLine 2s ease-out 0.7s forwards"
                            }}
                          />
                          
                          {/* Data points */}
                          {[
                            { x: 0, y: 120 },
                            { x: 50, y: 80 },
                            { x: 100, y: 100 },
                            { x: 150, y: 60 },
                            { x: 200, y: 90 },
                            { x: 250, y: 40 },
                            { x: 300, y: 70 },
                            { x: 350, y: 30 },
                            { x: 400, y: 50 }
                          ].map((point, i) => (
                            <circle
                              key={i}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="#3B82F6"
                              stroke="white"
                              strokeWidth="2"
                              className="animate-in fade-in-0 scale-in-0 duration-300"
                              style={{ animationDelay: `${1000 + i * 100}ms` }}
                            />
                          ))}
                        </svg>
                      </div>
                      <div className="flex justify-between mt-4 text-sm text-ink-soft">
                        {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, index) => (
                          <span key={week} className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${1200 + index * 100}ms` }}>{week}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </PageTransition>
  )
}

// Static data for statistics
const summaryStats = [
  {
    label: "Focused Hours",
    value: "125",
    icon: <Clock className="w-5 h-5" />
  },
  {
    label: "Study Session Streak",
    value: "28",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    label: "Study Partners",
    value: "15",
    icon: <Users className="w-5 h-5" />
  },
  {
    label: "Tasks Completed",
    value: "350",
    icon: <Award className="w-5 h-5" />
  }
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

const subjectData = [
  { name: "Mathematics", partners: 8, percentage: 80 },
  { name: "Computer Science", partners: 6, percentage: 60 },
  { name: "Physics", partners: 4, percentage: 40 },
  { name: "Chemistry", partners: 3, percentage: 30 }
]
