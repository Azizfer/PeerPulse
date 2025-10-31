"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, TrendingUp, BookOpen, MessageSquare, ThumbsUp, MessageCircle, Send, Plus, Filter, Settings, Lock, Clock, Heart, Lightbulb, Award, ImageIcon, FileText, X, Smile, Globe, ZoomIn, ZoomOut, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CustomSelect } from "@/components/ui/custom-select"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Document, Page, pdfjs } from 'react-pdf'
import { ImageCarousel } from "@/components/community/ImageCarousel"
import { PDFPreview } from "@/components/community/PDFPreview"
import { PDFViewerModal } from "@/components/community/PDFViewerModal"

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const communities = [
  {
    id: 1,
    name: "Advanced Calculus Study Group",
    description:
      "Deep dive into calculus concepts with fellow math enthusiasts. We cover derivatives, integrals, and real-world applications.",
    members: 24,
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
    members: 18,
    subject: "Biology",
    level: "Intermediate",
    meetingTime: "Thursdays 6 PM",
    creator: "Alex Rodriguez",
    isPremium: true,
    isPublic: false,
    membershipStatus: null,
  },
  {
    id: 3,
    name: "Computer Science Algorithms",
    description:
      "Master data structures and algorithms together. Perfect for coding interviews and competitive programming.",
    members: 31,
    subject: "Computer Science",
    level: "Intermediate",
    meetingTime: "Saturdays 3 PM",
    creator: "Mike Johnson",
    isPremium: true,
    isPublic: true,
    membershipStatus: null,
  },
  {
    id: 4,
    name: "Spanish Conversation Circle",
    description: "Practice Spanish conversation skills in a supportive environment. All levels welcome!",
    members: 15,
    subject: "Languages",
    level: "All Levels",
    meetingTime: "Wednesdays 5 PM",
    creator: "Maria Garcia",
    isPremium: true,
    isPublic: true,
    membershipStatus: null,
  },
  {
    id: 5,
    name: "Physics Problem Solving",
    description:
      "Tackle challenging physics problems together. Focus on mechanics, thermodynamics, and electromagnetism.",
    members: 22,
    subject: "Physics",
    level: "Advanced",
    meetingTime: "Mondays 8 PM",
    creator: "Prof. David Kim",
    isPremium: true,
    isPublic: false,
    membershipStatus: null,
  },
  {
    id: 6,
    name: "Creative Writing Workshop",
    description: "Share your writing, get feedback, and improve your craft with fellow writers and literature lovers.",
    members: 12,
    subject: "Literature",
    level: "All Levels",
    meetingTime: "Fridays 4 PM",
    creator: "Emma Thompson",
    isPremium: true,
    isPublic: true,
    membershipStatus: null,
  },
]

// Mock data for premium users' communities
const myCommunitiesData = [
  {
    id: 1,
    name: "Advanced Calculus Study Group",
    subject: "Mathematics",
    members: 24,
    unreadPosts: 5,
  },
  {
    id: 2,
    name: "Computer Science Algorithms",
    subject: "Computer Science",
    members: 31,
    unreadPosts: 12,
  },
]

// Mock posts for premium users
const communityPostsData = [
  {
    id: 1,
    communityId: 1,
    communityName: "Advanced Calculus Study Group",
    author: "Sarah Chen",
    authorAvatar: "SC",
    content: "Hey everyone! I found this great resource for understanding derivatives. Who wants to do a group study session this weekend?",
    timestamp: "2 hours ago",
    likes: 12,
    comments: [
      { id: 1, author: "John Doe", authorAvatar: "JD", content: "This is super helpful! Thanks for sharing.", timestamp: "1 hour ago" },
      { id: 2, author: "Jane Smith", authorAvatar: "JS", content: "I'd love to join the study session!", timestamp: "30 mins ago" },
    ],
    isLiked: false,
    files: [] as { name: string; type: string; url: string }[],
  },
  {
    id: 2,
    communityId: 2,
    communityName: "Computer Science Algorithms",
    author: "Mike Johnson",
    authorAvatar: "MJ",
    content: "Just finished implementing a binary search tree! Happy to help anyone struggling with tree structures.",
    timestamp: "5 hours ago",
    likes: 18,
    comments: [
      { id: 1, author: "Alex Brown", authorAvatar: "AB", content: "How did you handle the balancing?", timestamp: "4 hours ago" },
    ],
    isLiked: true,
    files: [] as { name: string; type: string; url: string }[],
  },
]

export default function CommunityPage() {
  const { toast } = useToast()
  
  const [posts, setPosts] = useState(communityPostsData)
  const [newPost, setNewPost] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null)
  const [selectedTab, setSelectedTab] = useState<"feed" | "all">("feed")
  const [feedFilter, setFeedFilter] = useState<number | "all">("all")
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null)
  const [postReactions, setPostReactions] = useState<{ [key: number]: string }>({})
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; pdfUrl: string; pdfName: string; page: number; numPages: number } | null>(null)
  
  // Suggested communities state
  const [suggestedCommunities, setSuggestedCommunities] = useState([
    { id: 1, name: "Physics Study Hub", members: 156, subject: "Physics", icon: "⚛️", isPublic: false, membershipStatus: null as 'member' | 'pending' | null },
    { id: 2, name: "Spanish Learners", members: 89, subject: "Languages", icon: "🗣️", isPublic: true, membershipStatus: null as 'member' | 'pending' | null },
    { id: 3, name: "Data Science 101", members: 234, subject: "Computer Science", icon: "📊", isPublic: true, membershipStatus: null as 'member' | 'pending' | null },
  ])
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ communityId: number; action: 'cancel' | 'leave'; name: string } | null>(null)
  
  // Create community state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [newCommunitySubject, setNewCommunitySubject] = useState("")
  const [isPublicCommunity, setIsPublicCommunity] = useState(true)
  const [communityPhoto, setCommunityPhoto] = useState<File | null>(null)
  const [communityPhotoPreview, setCommunityPhotoPreview] = useState<string>("")
  
  // Trending topics state
  const [trendingTopics, setTrendingTopics] = useState([
    { tag: "#MidtermPrep", posts: 45 },
    { tag: "#StudyTips", posts: 32 },
    { tag: "#GroupStudy", posts: 28 },
    { tag: "#ExamSeason", posts: 24 },
    { tag: "#MathHelp", posts: 19 },
  ])
  
  // Reaction types
  const reactions = [
    { id: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-600' },
    { id: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-600' },
    { id: 'supportive', icon: Heart, label: 'Supportive', color: 'text-pink-600' },
    { id: 'helpful', icon: Award, label: 'Helpful', color: 'text-green-600' },
  ]

  const handleJoinSuggestedCommunity = (communityId: number) => {
    setSuggestedCommunities(prev => prev.map(c => {
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

  const handleSuggestedButtonClick = (community: typeof suggestedCommunities[0]) => {
    if (community.membershipStatus === 'pending') {
      setConfirmAction({ communityId: community.id, action: 'cancel', name: community.name })
      setShowConfirmDialog(true)
    } else if (community.membershipStatus === 'member') {
      setConfirmAction({ communityId: community.id, action: 'leave', name: community.name })
      setShowConfirmDialog(true)
    } else {
      handleJoinSuggestedCommunity(community.id)
    }
  }

  const handleConfirm = () => {
    if (!confirmAction) return

    if (confirmAction.action === 'cancel' || confirmAction.action === 'leave') {
      setSuggestedCommunities(prev => prev.map(c => 
        c.id === confirmAction.communityId ? { ...c, membershipStatus: null } : c
      ))
    }

    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  const handleCommunityPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCommunityPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCommunityPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCommunity = () => {
    if (newCommunityName && newCommunityDescription && newCommunitySubject) {
      toast({
        title: "Community Created! 🎉",
        description: `${newCommunityName} has been created successfully`,
        variant: "success"
      })
      
      // Reset form
      setNewCommunityName("")
      setNewCommunityDescription("")
      setNewCommunitySubject("")
      setIsPublicCommunity(true)
      setCommunityPhoto(null)
      setCommunityPhotoPreview("")
      setShowCreateModal(false)
    }
  }
  
  const handleReaction = (postId: number, reactionType: string) => {
    // Toggle reaction - if same reaction is clicked, remove it
    if (postReactions[postId] === reactionType) {
      const updatedReactions = { ...postReactions }
      delete updatedReactions[postId]
      setPostReactions(updatedReactions)
    } else {
      setPostReactions({ ...postReactions, [postId]: reactionType })
    }
    setShowReactionPicker(null)
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }
  
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }
  
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w]+/g
    const hashtags = text.match(hashtagRegex) || []
    return hashtags.map(tag => tag.toLowerCase())
  }

  const renderContentWithHashtags = (content: string) => {
    const hashtagRegex = /#[\w]+/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = hashtagRegex.exec(content)) !== null) {
      // Add text before hashtag
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }
      // Add hashtag in blue
      parts.push(
        <span key={match.index} className="text-blue-600 font-medium">
          {match[0]}
        </span>
      )
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }
    
    return parts
  }

  const updateTrendingTopics = (hashtags: string[]) => {
    if (hashtags.length === 0) return

    setTrendingTopics(prev => {
      const updatedTopics = [...prev]
      
      hashtags.forEach(hashtag => {
        const existingIndex = updatedTopics.findIndex(topic => topic.tag.toLowerCase() === hashtag)
        
        if (existingIndex >= 0) {
          // Increment existing hashtag
          updatedTopics[existingIndex] = {
            ...updatedTopics[existingIndex],
            posts: updatedTopics[existingIndex].posts + 1
          }
        } else {
          // Add new hashtag
          updatedTopics.push({
            tag: hashtag,
            posts: 1
          })
        }
      })
      
      // Sort by post count (descending) and take top 5
      return updatedTopics.sort((a, b) => b.posts - a.posts).slice(0, 5)
    })
  }

  const handleCreatePost = () => {
    if (newPost.trim() && selectedCommunity) {
      const community = myCommunitiesData.find(c => c.id === selectedCommunity)
      
      // Extract hashtags from the post
      const hashtags = extractHashtags(newPost)
      
      // Convert files to URLs for display
      const fileUrls = uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      }))
      
      // Create new post object
      const newPostObject = {
        id: posts.length + 1,
        communityId: selectedCommunity,
        communityName: community?.name || "",
        author: "You",
        authorAvatar: "YU",
        content: newPost.trim(),
        timestamp: "Just now",
        likes: 0,
        comments: [],
        isLiked: false,
        files: fileUrls,
      }
      
      // Add new post to the beginning of the posts array
      setPosts([newPostObject, ...posts])
      
      // Update trending topics with extracted hashtags
      updateTrendingTopics(hashtags)
      
      // Clear the form
      setNewPost("")
      setSelectedCommunity(null)
      setUploadedFiles([])
    }
  }
  
  const handleLeaveCommunity = (communityId: number, communityName: string) => {
    if (confirm(`Are you sure you want to leave "${communityName}"?`)) {
      toast({
        title: "Left Community",
        description: `You've left ${communityName}`,
      })
    }
  }
  
  const handleAddComment = (postId: number) => {
    const commentText = commentInputs[postId]?.trim()
    if (commentText) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: post.comments.length + 1,
                author: "You",
                authorAvatar: "AJ",
                content: commentText,
                timestamp: "Just now"
              }
            ]
          }
        }
        return post
      }))
      setCommentInputs({ ...commentInputs, [postId]: "" })
      // No toast needed - seeing the comment appear is confirmation enough
    }
  }
  
  const toggleComments = (postId: number) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] })
  }
  
  const filteredPosts = feedFilter === "all" 
    ? posts 
    : posts.filter(post => post.communityId === feedFilter)

  // Feed View
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Feed</h1>
            <Button 
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Community
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Content - Feed */}
            <div className="lg:col-span-8 space-y-3">
                  {/* Create Post Card */}
                  <Card className="bg-[#fdfcfa] border-2 border-gray-300">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-white">AJ</span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share something with your communities..."
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-[#fdfcfa] hover:border-gray-400 transition-all duration-200 resize-none"
                            rows={2}
                          />
                          {/* File Previews */}
                          {uploadedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="relative bg-gray-100 rounded-lg p-2 pr-8">
                                  <div className="flex items-center gap-2">
                                    {file.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    <span className="text-xs">{file.name.slice(0, 20)}</span>
                                  </div>
                                  <button onClick={() => removeFile(index)} className="absolute top-1 right-1 text-gray-500 hover:text-red-600">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-start justify-between mt-2 gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              {/* Image Upload */}
                              <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors">
                                <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                                <ImageIcon className="w-4 h-4" />
                              </label>
                              {/* PDF Upload */}
                              <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors">
                                <input type="file" accept=".pdf,.doc,.docx" multiple onChange={handleFileUpload} className="hidden" />
                                <FileText className="w-4 h-4" />
                              </label>
                              <CustomSelect
                                value={selectedCommunity?.toString() || ""}
                                onChange={(value) => setSelectedCommunity(value ? Number(value) : null)}
                                placeholder="Select community..."
                                options={myCommunitiesData.map(community => ({
                                  value: community.id.toString(),
                                  label: community.name
                                }))}
                                className="max-w-xs"
                              />
                            </div>
                            <Button 
                              onClick={handleCreatePost} 
                              disabled={!newPost.trim() || !selectedCommunity}
                              className="h-7 px-3 text-xs"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Communities Tabs - Reddit Style */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                      onClick={() => setFeedFilter("all")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        feedFilter === "all"
                          ? "bg-[#0A0A0A] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      All
                    </button>
                    {myCommunitiesData.map(community => (
                      <button
                        key={community.id}
                        onClick={() => setFeedFilter(community.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                          feedFilter === community.id
                            ? "bg-blue-600 text-white"
                            : "bg-[#fdfcfa] border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {community.name}
                        {community.unreadPosts > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {community.unreadPosts}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Posts Feed */}
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="bg-[#fdfcfa] border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        {/* Post Header */}
                        <div className="flex items-start gap-2 mb-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-white">{post.authorAvatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">{post.author}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{post.timestamp}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {post.communityName}
                            </Badge>
                          </div>
                        </div>

                        {/* Post Content */}
                        <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{renderContentWithHashtags(post.content)}</p>

                        {/* Attached Files */}
                        {post.files && post.files.length > 0 && (
                          <div className="mb-3 space-y-3">
                            {(() => {
                              // Group files by type
                              const images = post.files.filter(f => f.type.startsWith('image/'))
                              const pdfs = post.files.filter(f => f.type === 'application/pdf')
                              
                              return (
                                <>
                                  {/* Image Carousel */}
                                  {images.length > 0 && (
                                    <ImageCarousel images={images} postId={post.id} />
                                  )}
                                  
                                  {/* PDF Previews */}
                                  {pdfs.map((pdf, pdfIndex) => (
                                    <PDFPreview
                                      key={pdfIndex}
                                      pdf={pdf}
                                      postId={post.id}
                                      pdfIndex={pdfIndex}
                                      onPageClick={(page, numPages) => 
                                        setPdfModal({ isOpen: true, pdfUrl: pdf.url, pdfName: pdf.name, page, numPages })
                                      }
                                    />
                                  ))}
                                </>
                              )
                            })()}
                          </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                          {/* Reaction Button with Picker */}
                          <div className="relative">
                            <button
                              onClick={() => setShowReactionPicker(showReactionPicker === post.id ? null : post.id)}
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              {(() => {
                                const reactionType = postReactions[post.id]
                                const reaction = reactions.find(r => r.id === reactionType)
                                const Icon = reaction?.icon || ThumbsUp
                                return <Icon className={`w-4 h-4 ${reaction?.color || ''}`} />
                              })()}
                              <span>{post.likes}</span>
                            </button>
                            {showReactionPicker === post.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-full left-0 mb-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg p-2 flex gap-2 z-10"
                              >
                                {reactions.map((reaction) => {
                                  const Icon = reaction.icon
                                  return (
                                    <button
                                      key={reaction.id}
                                      onClick={() => handleReaction(post.id, reaction.id)}
                                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                      title={reaction.label}
                                    >
                                      <Icon className={`w-5 h-5 ${reaction.color} group-hover:scale-110 transition-transform`} />
                                    </button>
                                  )
                                })}
                              </motion.div>
                            )}
                          </div>
                          <button
                            onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                          </button>
                        </div>

                        {/* Comments Section */}
                        <AnimatePresence>
                        {showComments[post.id] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="mt-3 pt-3 border-t border-gray-100 space-y-2 overflow-hidden"
                          >
                            {/* Existing Comments */}
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-semibold text-white">{comment.authorAvatar}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-900">{comment.author}</span>
                                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-gray-700 mt-0.5">{comment.content}</p>
                                </div>
                              </div>
                            ))}

                            {/* Add Comment Input */}
                            <div className="flex gap-2 mt-3">
                              <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-semibold text-white">AJ</span>
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={commentInputs[post.id] || ""}
                                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                  onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
                                  className="flex-1 px-2 py-1.5 border-2 border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-[#fdfcfa] hover:border-gray-400 transition-all duration-200"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(post.id)}
                                  disabled={!commentInputs[post.id]?.trim()}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  ))}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              {/* Suggested Communities */}
              <Card className="bg-[#fdfcfa] border-2 border-gray-300">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Suggested Communities</h3>
                  <div className="space-y-3">
                    {suggestedCommunities.map((community) => (
                      <div key={community.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="text-2xl">{community.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 truncate">{community.name}</h4>
                          <p className="text-xs text-gray-500">{community.members} members</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleSuggestedButtonClick(community)}
                          className={`h-6 px-2 text-xs ${
                            community.membershipStatus === 'member'
                              ? 'bg-emerald-500 hover:bg-emerald-600'
                              : community.membershipStatus === 'pending'
                              ? 'bg-amber-500 hover:bg-amber-600'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white`}
                        >
                          {community.membershipStatus === 'member' ? 'Joined' : 
                           community.membershipStatus === 'pending' ? 'Pending' : 
                           community.isPublic ? 'Join' : 'Request'}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Link href="/explore">
                    <Button variant="ghost" className="w-full mt-3 h-7 text-xs text-blue-600 hover:text-blue-700">
                      See all communities
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="bg-[#fdfcfa] border-2 border-gray-300">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Trending Topics</h3>
                  <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors text-left"
                      >
                        <span className="text-xs font-medium text-blue-600">{topic.tag}</span>
                        <span className="text-xs text-gray-500">{topic.posts} posts</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Active Members</span>
                      <span className="text-sm font-bold text-gray-900">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">New Posts</span>
                      <span className="text-sm font-bold text-gray-900">63</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Study Sessions</span>
                      <span className="text-sm font-bold text-gray-900">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="bg-[#fdfcfa] border-2 border-gray-300">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">⭐ Top Contributors</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Sarah Chen", points: 1250, avatar: "SC", badge: "🥇" },
                      { name: "Mike Johnson", points: 980, avatar: "MJ", badge: "🥈" },
                      { name: "Emma Davis", points: 845, avatar: "ED", badge: "🥉" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-lg">{user.badge}</span>
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-white">{user.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.points} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                    className="flex-1 bg-gray-700 hover:bg-gray-800"
                  >
                    Yes, {confirmAction.action === 'cancel' ? 'Cancel' : 'Leave'}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Create Community Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowCreateModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Create Community</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Community Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl border-2 border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                        {communityPhotoPreview ? (
                          <img src={communityPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCommunityPhotoUpload}
                          className="hidden"
                          id="community-photo"
                        />
                        <label htmlFor="community-photo">
                          <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                            <span>Upload Photo</span>
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Community Name
                    </label>
                    <input
                      type="text"
                      value={newCommunityName}
                      onChange={(e) => setNewCommunityName(e.target.value)}
                      placeholder="e.g., Advanced Calculus Study Group"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newCommunitySubject}
                      onChange={(e) => setNewCommunitySubject(e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newCommunityDescription}
                      onChange={(e) => setNewCommunityDescription(e.target.value)}
                      placeholder="Describe what your community is about..."
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Privacy
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPublicCommunity(true)}
                        className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                          isPublicCommunity
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <Globe className="w-4 h-4 inline mr-1" />
                        Public
                      </button>
                      <button
                        onClick={() => setIsPublicCommunity(false)}
                        className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                          !isPublicCommunity
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <Lock className="w-4 h-4 inline mr-1" />
                        Private
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button
                      onClick={() => setShowCreateModal(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCommunity}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!newCommunityName || !newCommunityDescription || !newCommunitySubject}
                    >
                      Create Community
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* PDF Zoom Modal */}
        <AnimatePresence>
          {pdfModal?.isOpen && (
            <PDFViewerModal
              isOpen={pdfModal.isOpen}
              pdfUrl={pdfModal.pdfUrl}
              pdfName={pdfModal.pdfName}
              initialPage={pdfModal.page}
              numPages={pdfModal.numPages}
              onClose={() => setPdfModal(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
