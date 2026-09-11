"use client"

import { useState } from "react"
import { Clock, Globe, Lock, Search, Users, X } from "lucide-react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/avatar"
import { Reveal } from "@/components/reveal"
import { AnimatePresence, motion } from "framer-motion"

const allCommunities = [
  {
    id: 1,
    name: "Advanced Calculus Study Group",
    description:
      "Deep dive into calculus with fellow math students. Derivatives, integrals and the problems that keep coming up in past papers.",
    members: 247,
    subject: "Mathematics",
    level: "Advanced",
    meetingTime: "Tuesdays 7 PM",
    creator: "Dr. Sarah Chen",
    isPublic: true,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 2,
    name: "Biology Pre-Med Students",
    description:
      "For pre-med students grinding through biology fundamentals, anatomy and MCAT preparation.",
    members: 189,
    subject: "Biology",
    level: "Intermediate",
    meetingTime: "Thursdays 6 PM",
    creator: "Alex Rodriguez",
    isPublic: false,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 3,
    name: "Computer Science Algorithms",
    description:
      "Master data structures and algorithms together. Built around interview prep and competitive programming.",
    members: 312,
    subject: "Computer Science",
    level: "Intermediate",
    meetingTime: "Saturdays 3 PM",
    creator: "Mike Johnson",
    isPublic: true,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 4,
    name: "Physics Study Hub",
    description:
      "From mechanics to quantum. Collaborative problem-solving, weekly problem sets, no judgement.",
    members: 156,
    subject: "Physics",
    level: "Advanced",
    meetingTime: "Wednesdays 5 PM",
    creator: "Emma Wilson",
    isPublic: false,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 5,
    name: "Spanish Learners",
    description:
      "Practise conversation and grammar together. Beginners welcome — everyone was a beginner last term.",
    members: 89,
    subject: "Languages",
    level: "Beginner",
    meetingTime: "Mondays 7 PM",
    creator: "Carlos Martinez",
    isPublic: true,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 6,
    name: "Data Science 101",
    description:
      "Python, machine learning and visualisation, with real projects you can put on a CV afterwards.",
    members: 234,
    subject: "Computer Science",
    level: "Intermediate",
    meetingTime: "Fridays 6 PM",
    creator: "Lisa Chen",
    isPublic: true,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 7,
    name: "World History Discussion",
    description:
      "Work through primary sources, argue about interpretations, and leave with better essays.",
    members: 67,
    subject: "History",
    level: "Intermediate",
    meetingTime: "Sundays 4 PM",
    creator: "Prof. Anderson",
    isPublic: false,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 8,
    name: "Chemistry Lab Partners",
    description:
      "Compare lab results, study reaction mechanisms and survive organic chemistry as a group.",
    members: 123,
    subject: "Chemistry",
    level: "Advanced",
    meetingTime: "Tuesdays 6 PM",
    creator: "Dr. Patel",
    isPublic: true,
    membershipStatus: null as "member" | "pending" | null,
  },
  {
    id: 9,
    name: "Creative Writing Circle",
    description:
      "Share drafts, get honest feedback and write more often than you would on your own.",
    members: 78,
    subject: "English",
    level: "All Levels",
    meetingTime: "Thursdays 7 PM",
    creator: "Jane Cooper",
    isPublic: true,
    membershipStatus: null as "member" | "pending" | null,
  },
]

const SUBJECTS = [
  "All",
  "Mathematics",
  "Biology",
  "Computer Science",
  "Physics",
  "Languages",
  "History",
  "Chemistry",
  "English",
]

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"]

export default function ExplorePage() {
  const [communities, setCommunities] = useState(allCommunities)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    communityId: number
    action: "cancel" | "leave"
    name: string
  } | null>(null)

  const filteredCommunities = communities.filter((community) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query)
    const matchesSubject = filterSubject === "all" || community.subject === filterSubject
    const matchesLevel = filterLevel === "all" || community.level === filterLevel
    return matchesSearch && matchesSubject && matchesLevel
  })

  const handleJoin = (communityId: number) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, membershipStatus: c.isPublic ? "member" : "pending" }
          : c,
      ),
    )
  }

  const handleButtonClick = (community: (typeof communities)[0]) => {
    if (community.membershipStatus === "pending") {
      setConfirmAction({ communityId: community.id, action: "cancel", name: community.name })
      setShowConfirmDialog(true)
    } else if (community.membershipStatus === "member") {
      setConfirmAction({ communityId: community.id, action: "leave", name: community.name })
      setShowConfirmDialog(true)
    } else {
      handleJoin(community.id)
    }
  }

  const handleConfirm = () => {
    if (!confirmAction) return
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === confirmAction.communityId ? { ...c, membershipStatus: null } : c,
      ),
    )
    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container-page py-10 sm:py-14">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Explore</p>
              <h1 className="mt-2 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[40px]">
                Find your people
              </h1>
              <p className="mt-2 text-[15px] text-ink-soft">
                Subject communities with regular sessions, shared resources and people who are
                stuck on the same things you are.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ---------------- Filters ---------------- */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search communities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-full border border-line-strong bg-surface pl-11 pr-4 text-[15px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SUBJECTS.map((subject) => {
                const active =
                  (filterSubject === "all" && subject === "All") || filterSubject === subject
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => setFilterSubject(subject === "All" ? "all" : subject)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 font-display text-[13px] font-semibold transition-colors ${
                      active
                        ? "bg-ink text-white"
                        : "border border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
                    }`}
                  >
                    {subject}
                  </button>
                )
              })}
            </div>

            <div className="h-6 w-px bg-line hidden sm:block" />

            <div className="flex gap-2 overflow-x-auto pb-1">
              {LEVELS.map((level) => {
                const active =
                  (filterLevel === "all" && level === "All") || filterLevel === level
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFilterLevel(level === "All" ? "all" : level)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-pulse-soft text-pulse-dark"
                        : "text-ink-mute hover:text-ink"
                    }`}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[13.5px] text-ink-mute">
          {filteredCommunities.length}{" "}
          {filteredCommunities.length === 1 ? "community" : "communities"} found
        </p>

        {/* ---------------- Grid ---------------- */}
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <Avatar name={community.name} size="md" />
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-[11.5px] font-semibold text-ink-mute"
                  title={community.isPublic ? "Public" : "Private"}
                >
                  {community.isPublic ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  {community.isPublic ? "Open" : "Request"}
                </span>
              </div>

              <h2 className="mt-4 font-display text-[17px] font-bold leading-snug tracking-[-0.02em] text-ink">
                {community.name}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="lilac">{community.subject}</Badge>
                <Badge variant="outline">{community.level}</Badge>
              </div>

              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink-soft">
                {community.description}
              </p>

              <div className="mt-4 space-y-1.5 border-t border-line pt-4">
                <p className="flex items-center gap-2 text-[13px] text-ink-mute">
                  <Users className="h-3.5 w-3.5" />
                  {community.members} members
                </p>
                <p className="flex items-center gap-2 text-[13px] text-ink-mute">
                  <Clock className="h-3.5 w-3.5" />
                  {community.meetingTime}
                </p>
              </div>

              <div className="mt-5">
                <Button
                  onClick={() => handleButtonClick(community)}
                  className="w-full"
                  size="sm"
                  variant={
                    community.membershipStatus === "member"
                      ? "accent"
                      : community.membershipStatus === "pending"
                        ? "secondary"
                        : "default"
                  }
                >
                  {community.membershipStatus === "member"
                    ? "Joined"
                    : community.membershipStatus === "pending"
                      ? "Request pending"
                      : community.isPublic
                        ? "Join community"
                        : "Request to join"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- Empty state ---------------- */}
        {filteredCommunities.length === 0 && (
          <div className="rounded-3xl border border-line bg-surface py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-sunken text-ink-faint">
              <Search className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-ink">No communities found</h3>
            <p className="mt-1.5 text-[14.5px] text-ink-soft">
              Try a different subject, or search for something broader.
            </p>
            <Button
              className="mt-6"
              variant="secondary"
              onClick={() => {
                setSearchQuery("")
                setFilterSubject("all")
                setFilterLevel("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      {/* ---------------- Confirm dialog ---------------- */}
      <AnimatePresence>
        {showConfirmDialog && confirmAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
              onClick={() => setShowConfirmDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-line bg-surface p-6 shadow-lift"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                  {confirmAction.action === "cancel" ? "Cancel request?" : "Leave community?"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-surface-sunken hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                {confirmAction.action === "cancel"
                  ? `Are you sure you want to cancel your request to join “${confirmAction.name}”?`
                  : `Are you sure you want to leave “${confirmAction.name}”?`}
              </p>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Keep it
                </Button>
                <Button size="sm" className="flex-1" onClick={handleConfirm}>
                  Yes, {confirmAction.action === "cancel" ? "cancel" : "leave"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
