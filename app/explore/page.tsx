"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Lock, Clock, TrendingUp, Globe, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"

const allCommunities = [
  {
    id: 1,
    name: "Advanced Calculus Study Group",
    description: "Deep dive into calculus concepts with fellow math enthusiasts. We cover derivatives, integrals, and real-world applications.",
    members: 247,
    subject: "Mathematics",
    level: "Advanced",
    meetingTime: "Tuesdays 7 PM",
    creator: "Dr. Sarah Chen",
    isPremium: true,
    isPublic: true,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 2,
    name: "Biology Pre-Med Students",
    description: "Study group for pre-med students focusing on biology fundamentals, anatomy, and MCAT preparation.",
    members: 189,
    subject: "Biology",
    level: "Intermediate",
    meetingTime: "Thursdays 6 PM",
    creator: "Alex Rodriguez",
    isPremium: true,
    isPublic: false,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 3,
    name: "Computer Science Algorithms",
    description: "Master data structures and algorithms together. Perfect for coding interviews and competitive programming.",
    members: 312,
    subject: "Computer Science",
    level: "Intermediate",
    meetingTime: "Saturdays 3 PM",
    creator: "Mike Johnson",
    isPremium: true,
    isPublic: true,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 4,
    name: "Physics Study Hub",
    description: "Explore physics concepts from mechanics to quantum theory. Collaborative problem-solving and discussions.",
    members: 156,
    subject: "Physics",
    level: "Advanced",
    meetingTime: "Wednesdays 5 PM",
    creator: "Emma Wilson",
    isPremium: true,
    isPublic: false,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 5,
    name: "Spanish Learners",
    description: "Practice Spanish conversation, grammar, and culture. All levels welcome from beginners to advanced.",
    members: 89,
    subject: "Languages",
    level: "Beginner",
    meetingTime: "Mondays 7 PM",
    creator: "Carlos Martinez",
    isPremium: true,
    isPublic: true,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 6,
    name: "Data Science 101",
    description: "Learn Python, machine learning, and data visualization. Build real-world projects together.",
    members: 234,
    subject: "Computer Science",
    level: "Intermediate",
    meetingTime: "Fridays 6 PM",
    creator: "Lisa Chen",
    isPremium: true,
    isPublic: true,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 7,
    name: "World History Discussion",
    description: "Explore historical events, analyze primary sources, and debate historical interpretations.",
    members: 67,
    subject: "History",
    level: "Intermediate",
    meetingTime: "Sundays 4 PM",
    creator: "Prof. Anderson",
    isPremium: true,
    isPublic: false,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 8,
    name: "Chemistry Lab Partners",
    description: "Collaborate on chemistry experiments, study reactions, and prepare for organic chemistry.",
    members: 123,
    subject: "Chemistry",
    level: "Advanced",
    meetingTime: "Tuesdays 6 PM",
    creator: "Dr. Patel",
    isPremium: true,
    isPublic: true,
    membershipStatus: null as 'member' | 'pending' | null,
  },
  {
    id: 9,
    name: "Creative Writing Circle",
    description: "Share your stories, get feedback, and improve your writing skills in a supportive environment.",
    members: 78,
    subject: "English",
    level: "All Levels",
    meetingTime: "Thursdays 7 PM",
    creator: "Jane Cooper",
    isPremium: true,
    isPublic: true,
    membershipStatus: null as 'member' | 'pending' | null,
  },
]

export default function ExplorePage() {
  const { toast } = useToast()
  const [communities, setCommunities] = useState(allCommunities)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ communityId: number; action: 'cancel' | 'leave'; name: string } | null>(null)

  const subjects = ["All", "Mathematics", "Biology", "Computer Science", "Physics", "Languages", "History", "Chemistry", "English"]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = filterSubject === "all" || community.subject === filterSubject
    return matchesSearch && matchesSubject
  })

  const handleJoin = (communityId: number) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        if (c.isPublic) {
          return { ...c, membershipStatus: 'member' }
        } else {
          return { ...c, membershipStatus: 'pending' }
        }
      }
      return c
    }))
  }

  const handleButtonClick = (community: typeof communities[0]) => {
    if (community.membershipStatus === 'pending') {
      setConfirmAction({ communityId: community.id, action: 'cancel', name: community.name })
      setShowConfirmDialog(true)
    } else if (community.membershipStatus === 'member') {
      setConfirmAction({ communityId: community.id, action: 'leave', name: community.name })
      setShowConfirmDialog(true)
    } else {
      handleJoin(community.id)
    }
  }

  const handleConfirm = () => {
    if (!confirmAction) return

    if (confirmAction.action === 'cancel' || confirmAction.action === 'leave') {
      setCommunities(prev => prev.map(c => 
        c.id === confirmAction.communityId ? { ...c, membershipStatus: null } : c
      ))
    }

    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f5f1e8] font-[Lexend,_'Noto_Sans',_sans-serif]">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore Communities</h1>
            <p className="text-sm text-gray-600">
              Discover and join study communities. Connect with students who share your interests.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-[#fdfcfa] hover:border-gray-400 transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {/* Subject Filters */}
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setFilterSubject(subject === "All" ? "all" : subject)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    (filterSubject === "all" && subject === "All") || filterSubject === subject
                      ? "bg-blue-600 text-white"
                      : "bg-[#fdfcfa] border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredCommunities.length} {filteredCommunities.length === 1 ? "community" : "communities"} found
            </p>
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="bg-[#fdfcfa] border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{community.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {community.subject}
                      </Badge>
                    </div>
                    <div className="ml-2">
                      {community.isPublic ? (
                        <Globe className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{community.description}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{community.members} members</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">Created by {community.creator}</p>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleButtonClick(community)}
                    className={`w-full h-8 text-xs ${
                      community.membershipStatus === 'member' 
                        ? 'bg-emerald-500 hover:bg-emerald-600' 
                        : community.membershipStatus === 'pending'
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {community.membershipStatus === 'member' ? 'Joined' : 
                     community.membershipStatus === 'pending' ? 'Pending Request' : 
                     community.isPublic ? 'Join Community' : 'Request to Join'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No communities found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setFilterSubject("all")
                  setFilterLevel("all")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && confirmAction && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowConfirmDialog(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-50 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {confirmAction.action === 'cancel' ? 'Cancel Request?' : 'Leave Community?'}
                  </h2>
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors -mt-1 -mr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-5">
                  {confirmAction.action === 'cancel' 
                    ? `Are you sure you want to cancel your request to join "${confirmAction.name}"?`
                    : `Are you sure you want to leave "${confirmAction.name}"?`
                  }
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowConfirmDialog(false)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    No, Keep It
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    size="sm"
                    className={`flex-1 ${
                      confirmAction.action === 'cancel' 
                        ? 'bg-gray-700 hover:bg-gray-800' 
                        : 'bg-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    Yes, {confirmAction.action === 'cancel' ? 'Cancel' : 'Leave'}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
