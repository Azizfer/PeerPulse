"use client"

import { useState } from "react"
import { Atom, BookOpen, Braces, CalendarDays, Check, ChevronRight, FlaskConical, Globe, Languages, Leaf, LockKeyhole, Search, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"
import { Drawer, DrawerBody, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

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


const subjects = [...new Set(allCommunities.map(community => community.subject))]
const subjectIcons = { Mathematics: BookOpen, Biology: Leaf, "Computer Science": Braces, Physics: Atom, Languages, History: BookOpen, Chemistry: FlaskConical, English: BookOpen }
type Community = typeof allCommunities[number]
type ListFilter = "all" | "member" | "pending"

export default function CommunitiesDirectory() {
  const [communities, setCommunities] = useState(allCommunities)
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("all")
  const [level, setLevel] = useState("all")
  const [list, setList] = useState<ListFilter>("all")
  const [confirm, setConfirm] = useState<Community | null>(null)
  const [notice, setNotice] = useState("")
  const joined = communities.filter(community => community.membershipStatus === "member").length
  const pending = communities.filter(community => community.membershipStatus === "pending").length
  const visible = communities.filter(community =>
    (list === "all" || community.membershipStatus === list) &&
    (subject === "all" || community.subject === subject) &&
    (level === "all" || community.level === level || community.level === "All Levels") &&
    `${community.name} ${community.description} ${community.subject}`.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const filtered = Boolean(query || subject !== "all" || level !== "all")
  const resetFilters = () => { setQuery(""); setSubject("all"); setLevel("all") }
  const join = (community: Community) => {
    if (community.membershipStatus === "pending") {
      setCommunities(previous => previous.map(item => item.id === community.id ? { ...item, membershipStatus: null } : item))
      setNotice(`Request canceled for ${community.name}.`)
      return
    }
    if (community.membershipStatus) { setConfirm(community); return }
    setCommunities(previous => previous.map(item => item.id === community.id ? { ...item, membershipStatus: item.isPublic ? "member" : "pending", members: item.members + (item.isPublic ? 1 : 0) } : item))
    setNotice(community.isPublic ? `You joined ${community.name} in this preview.` : `Your request to join ${community.name} is pending in this preview.`)
  }
  const leave = () => {
    if (!confirm) return
    setCommunities(previous => previous.map(item => item.id === confirm.id ? { ...item, membershipStatus: null, members: item.members - (item.membershipStatus === "member" ? 1 : 0) } : item))
    setNotice(confirm.membershipStatus === "member" ? `You left ${confirm.name}.` : `Request canceled for ${confirm.name}.`)
    setConfirm(null)
  }

  return (
    <div className="min-h-screen bg-paper">
      <main className="container-page max-w-6xl py-10 sm:py-14">
        <header className="mb-8">
          <p className="eyebrow">Learn with your people</p>
          <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[40px]">Communities</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink-soft">Find a space for your subject. Ask questions, swap resources, and work through the difficult parts together.</p>
        </header>

        <div className="mb-6 rounded-3xl border border-line bg-surface p-4 shadow-soft sm:p-5">
          <div className="mb-4 flex flex-wrap gap-1 border-b border-line pb-4" aria-label="Community lists">
            {([{ value: "all", label: "Discover", count: communities.length }, { value: "member", label: "Joined", count: joined }, { value: "pending", label: "Requests", count: pending }] as const).map(tab => (
              <button key={tab.value} type="button" aria-pressed={list === tab.value} onClick={() => { setList(tab.value); setNotice("") }}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse ${list === tab.value ? "bg-pulse-soft text-pulse-dark" : "text-ink-soft hover:bg-surface-sunken"}`}>
                {tab.label}<span className="text-[10px] font-medium opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_190px_160px]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-mute" strokeWidth={1.8} />
              <Input aria-label="Search communities" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name or subject" className="pl-9 text-sm" />
            </div>
            <div><label htmlFor="directory-subject" className="sr-only">Subject</label><CustomSelect id="directory-subject" value={subject} onChange={setSubject} options={[{ value: "all", label: "All subjects" }, ...subjects.map(value => ({ value, label: value }))]} /></div>
            <div><label htmlFor="directory-level" className="sr-only">Study level</label><CustomSelect id="directory-level" value={level} onChange={setLevel} options={[{ value: "all", label: "All levels" }, ...["Beginner", "Intermediate", "Advanced"].map(value => ({ value, label: value }))]} /></div>
          </div>
        </div>

        {notice && <p role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-pulse/20 bg-pulse-soft px-4 py-3 text-xs leading-6 text-pulse-dark"><Check className="mt-1 size-3.5 shrink-0" />{notice}</p>}
        <div className="mb-4 flex items-center justify-between gap-3">
          <p aria-live="polite" className="text-xs text-ink-mute">{visible.length} {visible.length === 1 ? "community" : "communities"}{list === "member" ? " joined" : list === "pending" ? " with pending requests" : " to explore"}</p>
          {filtered && <button type="button" onClick={resetFilters} className="rounded-lg px-2 py-1 text-xs font-semibold text-pulse-dark hover:bg-pulse-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse">Clear filters</button>}
        </div>

        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map(community => {
            const Icon = subjectIcons[community.subject as keyof typeof subjectIcons] || UsersRound
            return (
              <article key={community.id} className="flex min-w-0 flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft transition-colors hover:border-line-strong">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-sunken text-pulse-dark"><Icon className="size-4" strokeWidth={1.8} /></span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-[10px] font-medium text-ink-soft">{community.isPublic ? <Globe className="size-3" /> : <LockKeyhole className="size-3" />}{community.isPublic ? "Open" : "By request"}</span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-pulse-dark">{community.subject}</p>
                <h2 className="mt-2 min-h-12 font-display text-base font-bold leading-6 tracking-tight text-ink">{community.name}</h2>
                <p className="mt-3 min-h-[72px] text-xs leading-6 text-ink-soft">{community.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-ink-mute">
                  <span className="inline-flex items-center gap-1.5"><UsersRound className="size-3.5" strokeWidth={1.8} />{community.members} members</span>
                  <span className="rounded-md border border-line px-2 py-0.5">{community.level}</span>
                </div>
                <div className="mt-auto pt-5">
                  <p className="mb-4 flex items-center gap-2 border-t border-line pt-4 text-[11px] text-ink-soft"><CalendarDays className="size-3.5 shrink-0 text-ink-mute" strokeWidth={1.8} />{community.meetingTime}</p>
                  <Button onClick={() => join(community)} variant={community.membershipStatus ? "outline" : community.isPublic ? "accent" : "secondary"} className="h-10 w-full text-xs">
                    {community.membershipStatus === "member" ? "Leave community" : community.membershipStatus === "pending" ? "Cancel request" : community.isPublic ? "Join community" : "Request to join"}
                    {!community.membershipStatus && <ChevronRight className="size-3.5" />}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        {visible.length === 0 && <section className="rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <UsersRound className="mx-auto size-6 text-pulse-dark" strokeWidth={1.6} />
          <h2 className="mt-4 text-base font-semibold text-ink">{filtered ? "No matching communities" : list === "member" ? "Find your first community" : "No pending requests"}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-ink-soft">{filtered ? "Try a broader search or a different subject." : list === "member" ? "Explore the directory and join a space for your subject." : "Requests to private communities will appear here."}</p>
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => { resetFilters(); if (!filtered) setList("all") }}>{filtered ? "Clear filters" : "Discover communities"}</Button>
        </section>}
        <p className="mt-6 text-[11px] leading-5 text-ink-mute">Preview directory · joining and requests are local to this page. Memberships are not yet synced with the feed.</p>
      </main>

      <Drawer open={Boolean(confirm)} onOpenChange={open => { if (!open) setConfirm(null) }}>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>{confirm?.membershipStatus === "member" ? "Leave this community?" : "Cancel your request?"}</DrawerTitle><DrawerDescription>{confirm?.name}</DrawerDescription></DrawerHeader>
          <DrawerBody><p className="text-sm leading-7 text-ink-soft">{confirm?.membershipStatus === "member" ? "This will remove it from your joined communities. You can join again later." : "Your pending request will be removed. You can send another request whenever you're ready."}</p></DrawerBody>
          <DrawerFooter><Button variant="destructive" onClick={leave} className="h-10">{confirm?.membershipStatus === "member" ? "Leave community" : "Cancel request"}</Button><Button variant="outline" onClick={() => setConfirm(null)} className="h-10">Keep it</Button></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
