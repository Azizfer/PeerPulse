"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
  Award,
  FileText,
  Heart,
  ImageIcon,
  Lightbulb,
  MessageCircle,
  Plus,
  Send,
  ThumbsUp,
  TrendingUp,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/avatar"
import { Reveal } from "@/components/reveal"
import { CustomSelect } from "@/components/ui/custom-select"
import { useToast } from "@/hooks/use-toast"
import { ImageCarousel } from "@/components/community/ImageCarousel"
import { PDFPreview, PDFViewerModal } from "@/components/community/pdf-lazy"

type Comment = {
  id: number
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
}

const myCommunitiesData = [
  { id: 1, name: "Advanced Calculus Study Group", subject: "Mathematics", members: 24, unreadPosts: 5 },
  { id: 2, name: "Computer Science Algorithms", subject: "Computer Science", members: 31, unreadPosts: 12 },
]

const communityPostsData = [
  {
    id: 1,
    communityId: 1,
    communityName: "Advanced Calculus Study Group",
    author: "Sarah Chen",
    authorAvatar: "SC",
    content:
      "Hey everyone! I found this great resource for understanding derivatives. Who wants to do a group study session this weekend? #MidtermPrep",
    timestamp: "2 hours ago",
    reactionCounts: { like: 8, insightful: 3, supportive: 1, helpful: 0 },
    comments: [
      {
        id: 1,
        author: "John Doe",
        authorAvatar: "JD",
        content: "This is super helpful! Thanks for sharing.",
        timestamp: "1 hour ago",
        likes: 3,
        replies: [
          {
            id: 1001,
            author: "Sarah Chen",
            authorAvatar: "SC",
            content: "Glad it helped!",
            timestamp: "50 mins ago",
            likes: 1,
            replies: [],
          },
        ],
      },
      {
        id: 2,
        author: "Jane Smith",
        authorAvatar: "JS",
        content: "I'd love to join the study session!",
        timestamp: "30 mins ago",
        likes: 0,
        replies: [],
      },
    ] as Comment[],
    isLiked: false,
    files: [] as { name: string; type: string; url: string }[],
  },
  {
    id: 2,
    communityId: 2,
    communityName: "Computer Science Algorithms",
    author: "Mike Johnson",
    authorAvatar: "MJ",
    content:
      "Just finished implementing a binary search tree! Happy to help anyone struggling with tree structures. #StudyTips",
    timestamp: "5 hours ago",
    reactionCounts: { like: 14, insightful: 2, supportive: 1, helpful: 1 },
    comments: [
      {
        id: 1,
        author: "Alex Brown",
        authorAvatar: "AB",
        content: "How did you handle the balancing?",
        timestamp: "4 hours ago",
        likes: 2,
        replies: [],
      },
    ] as Comment[],
    isLiked: true,
    files: [] as { name: string; type: string; url: string }[],
  },
]

const REACTIONS = [
  { id: "like", icon: ThumbsUp, label: "Like", color: "text-pulse-dark", bg: "bg-pulse-soft" },
  { id: "insightful", icon: Lightbulb, label: "Insightful", color: "text-lemon-deep", bg: "bg-lemon-soft" },
  { id: "supportive", icon: Heart, label: "Supportive", color: "text-rose-deep", bg: "bg-rose" },
  { id: "helpful", icon: Award, label: "Helpful", color: "text-pulse", bg: "bg-pulse-soft" },
] as const

type ReactionId = (typeof REACTIONS)[number]["id"]

export default function CommunityPage() {
  const { toast } = useToast()

  const [posts, setPosts] = useState(communityPostsData)
  const [newPost, setNewPost] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null)
  const [feedFilter, setFeedFilter] = useState<number | "all">("all")
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null)
  const [postReactions, setPostReactions] = useState<{ [key: number]: ReactionId }>({})
  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean
    pdfUrl: string
    pdfName: string
    page: number
    numPages: number
  } | null>(null)

  // Which comment (identified by "postId:commentId") currently has its inline reply
  // box open, Instagram/Facebook style — replies render nested right under that comment.
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({})
  const replyInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Per-comment/reply like state, keyed by "postId:commentId" or "postId:commentId:replyId"
  // so ids don't collide across posts/comments.
  const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({})

  const [suggestedCommunities, setSuggestedCommunities] = useState([
    { id: 1, name: "Physics Study Hub", members: 156, subject: "Physics", icon: "⚛️", isPublic: false, membershipStatus: null as "member" | "pending" | null },
    { id: 2, name: "Spanish Learners", members: 89, subject: "Languages", icon: "🗣️", isPublic: true, membershipStatus: null as "member" | "pending" | null },
    { id: 3, name: "Data Science 101", members: 234, subject: "Computer Science", icon: "📊", isPublic: true, membershipStatus: null as "member" | "pending" | null },
  ])

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    communityId: number
    action: "cancel" | "leave"
    name: string
  } | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [newCommunitySubject, setNewCommunitySubject] = useState("")
  const [isPublicCommunity, setIsPublicCommunity] = useState(true)
  const [communityPhoto, setCommunityPhoto] = useState<File | null>(null)
  const [communityPhotoPreview, setCommunityPhotoPreview] = useState<string>("")

  const [trendingTopics, setTrendingTopics] = useState([
    { tag: "#MidtermPrep", posts: 45 },
    { tag: "#StudyTips", posts: 32 },
    { tag: "#GroupStudy", posts: 28 },
    { tag: "#ExamSeason", posts: 24 },
    { tag: "#MathHelp", posts: 19 },
  ])

  const handleJoinSuggestedCommunity = (communityId: number) => {
    setSuggestedCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, membershipStatus: c.isPublic ? "member" : "pending" }
          : c,
      ),
    )
  }

  const handleSuggestedButtonClick = (community: (typeof suggestedCommunities)[0]) => {
    if (community.membershipStatus === "pending") {
      setConfirmAction({ communityId: community.id, action: "cancel", name: community.name })
      setShowConfirmDialog(true)
    } else if (community.membershipStatus === "member") {
      setConfirmAction({ communityId: community.id, action: "leave", name: community.name })
      setShowConfirmDialog(true)
    } else {
      handleJoinSuggestedCommunity(community.id)
    }
  }

  const handleConfirm = () => {
    if (!confirmAction) return
    setSuggestedCommunities((prev) =>
      prev.map((c) => (c.id === confirmAction.communityId ? { ...c, membershipStatus: null } : c)),
    )
    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  const handleCommunityPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCommunityPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setCommunityPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCommunity = () => {
    if (newCommunityName && newCommunityDescription && newCommunitySubject) {
      toast({
        title: "Community created",
        description: `${newCommunityName} is live.`,
        variant: "success",
      })
      setNewCommunityName("")
      setNewCommunityDescription("")
      setNewCommunitySubject("")
      setIsPublicCommunity(true)
      setCommunityPhoto(null)
      setCommunityPhotoPreview("")
      setShowCreateModal(false)
    }
  }

  // Picking a reaction updates that post's aggregate counts (swap the old pick's count
  // out, the new pick's count in) so the top-reactions summary stays accurate.
  const handleReaction = (postId: number, reactionType: ReactionId) => {
    const previous = postReactions[postId]

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const counts = { ...post.reactionCounts }
        if (previous) counts[previous] = Math.max(0, counts[previous] - 1)
        if (previous !== reactionType) counts[reactionType] = (counts[reactionType] || 0) + 1
        return { ...post, reactionCounts: counts }
      }),
    )

    setPostReactions((prev) => {
      const next = { ...prev }
      if (previous === reactionType) {
        delete next[postId]
      } else {
        next[postId] = reactionType
      }
      return next
    })
    setShowReactionPicker(null)
  }

  const getReactionSummary = (post: (typeof communityPostsData)[number]) => {
    const total = Object.values(post.reactionCounts).reduce((a, b) => a + b, 0)
    const top = REACTIONS.map((r) => ({ ...r, count: post.reactionCounts[r.id as ReactionId] || 0 }))
      .filter((r) => r.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
    return { total, top }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w]+/g
    const hashtags = text.match(hashtagRegex) || []
    return hashtags.map((tag) => tag.toLowerCase())
  }

  const renderContentWithHashtags = (content: string) => {
    const hashtagRegex = /#[\w]+/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = hashtagRegex.exec(content)) !== null) {
      if (match.index > lastIndex) parts.push(content.substring(lastIndex, match.index))
      parts.push(
        <span key={match.index} className="font-medium text-pulse-dark">
          {match[0]}
        </span>,
      )
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < content.length) parts.push(content.substring(lastIndex))
    return parts
  }

  const updateTrendingTopics = (hashtags: string[]) => {
    if (hashtags.length === 0) return
    setTrendingTopics((prev) => {
      const updatedTopics = [...prev]
      hashtags.forEach((hashtag) => {
        const existingIndex = updatedTopics.findIndex((topic) => topic.tag.toLowerCase() === hashtag)
        if (existingIndex >= 0) {
          updatedTopics[existingIndex] = {
            ...updatedTopics[existingIndex],
            posts: updatedTopics[existingIndex].posts + 1,
          }
        } else {
          updatedTopics.push({ tag: hashtag, posts: 1 })
        }
      })
      return updatedTopics.sort((a, b) => b.posts - a.posts).slice(0, 5)
    })
  }

  const handleCreatePost = () => {
    if (newPost.trim() && selectedCommunity) {
      const community = myCommunitiesData.find((c) => c.id === selectedCommunity)
      const hashtags = extractHashtags(newPost)
      const fileUrls = uploadedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      }))

      setPosts([
        {
          id: posts.length + 1,
          communityId: selectedCommunity,
          communityName: community?.name || "",
          author: "You",
          authorAvatar: "YU",
          content: newPost.trim(),
          timestamp: "Just now",
          reactionCounts: { like: 0, insightful: 0, supportive: 0, helpful: 0 },
          comments: [],
          isLiked: false,
          files: fileUrls,
        },
        ...posts,
      ])

      updateTrendingTopics(hashtags)
      setNewPost("")
      setSelectedCommunity(null)
      setUploadedFiles([])
    }
  }

  const handleAddComment = (postId: number) => {
    const commentText = commentInputs[postId]?.trim()
    if (commentText) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: Date.now(),
                    author: "You",
                    authorAvatar: "AJ",
                    content: commentText,
                    timestamp: "Just now",
                    likes: 0,
                    replies: [],
                  },
                ],
              }
            : post,
        ),
      )
      setCommentInputs({ ...commentInputs, [postId]: "" })
    }
  }

  const openReplyBox = (postId: number, commentId: number) => {
    const key = `${postId}:${commentId}`
    setShowComments((prev) => ({ ...prev, [postId]: true }))
    setReplyingTo(key)
    setReplyInputs((prev) => ({ ...prev, [key]: prev[key] || "" }))
    requestAnimationFrame(() => replyInputRefs.current[key]?.focus())
  }

  const handleAddReply = (postId: number, commentId: number) => {
    const key = `${postId}:${commentId}`
    const text = replyInputs[key]?.trim()
    if (!text) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      id: Date.now(),
                      author: "You",
                      authorAvatar: "AJ",
                      content: text,
                      timestamp: "Just now",
                      likes: 0,
                      replies: [],
                    },
                  ],
                }
              : comment,
          ),
        }
      }),
    )
    setReplyInputs((prev) => ({ ...prev, [key]: "" }))
    setReplyingTo(null)
  }

  const toggleCommentLike = (key: string) => {
    setLikedComments((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredPosts = feedFilter === "all" ? posts : posts.filter((p) => p.communityId === feedFilter)

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Community</p>
              <h1 className="mt-2 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[40px]">
                Feed
              </h1>
              <p className="mt-2 text-[15px] text-ink-soft">
                Questions, wins and resources from the subjects you&apos;re actually taking.
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Create community
            </Button>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* ===================== Feed ===================== */}
          <div className="space-y-5 lg:col-span-8">
            {/* ---------- Composer ---------- */}
            <Reveal>
              <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
                <div className="flex gap-3">
                  <Avatar name="Alex Johnson" size="sm" />
                  <div className="min-w-0 flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Ask a question, or share something that finally clicked…"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[14.5px] leading-relaxed text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, index) => (
                          <span
                            key={index}
                            className="relative inline-flex items-center gap-2 rounded-xl bg-surface-sunken py-1.5 pl-3 pr-8 text-[13px] text-ink-soft"
                          >
                            {file.type.startsWith("image/") ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            <span className="max-w-[160px] truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              aria-label={`Remove ${file.name}`}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-mute transition-colors hover:text-rose-deep"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <label
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-ink-mute transition-colors hover:bg-surface-sunken hover:text-ink"
                          title="Add images"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <ImageIcon className="h-[18px] w-[18px]" />
                        </label>
                        <label
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-ink-mute transition-colors hover:bg-surface-sunken hover:text-ink"
                          title="Add documents"
                        >
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <FileText className="h-[18px] w-[18px]" />
                        </label>

                        <div className="w-[200px]">
                          <CustomSelect
                            value={selectedCommunity?.toString() || ""}
                            onChange={(value) => setSelectedCommunity(value ? Number(value) : null)}
                            placeholder="Post to…"
                            options={myCommunitiesData.map((community) => ({
                              value: community.id.toString(),
                              label: community.name,
                            }))}
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={handleCreatePost}
                        disabled={!newPost.trim() || !selectedCommunity}
                      >
                        <Send className="h-4 w-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---------- Filters ---------- */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setFeedFilter("all")}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-display text-[13px] font-semibold transition-colors ${
                  feedFilter === "all"
                    ? "bg-ink text-white"
                    : "border border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
                }`}
              >
                All
              </button>
              {myCommunitiesData.map((community) => (
                <button
                  key={community.id}
                  type="button"
                  onClick={() => setFeedFilter(community.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-display text-[13px] font-semibold transition-colors ${
                    feedFilter === community.id
                      ? "bg-ink text-white"
                      : "border border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
                  }`}
                >
                  {community.name}
                  {community.unreadPosts > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                        feedFilter === community.id ? "bg-white/20 text-white" : "bg-rose text-rose-deep"
                      }`}
                    >
                      {community.unreadPosts}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ---------- Posts ---------- */}
            {filteredPosts.map((post) => {
              const { total, top } = getReactionSummary(post)
              const userReaction = postReactions[post.id]

              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:border-line-strong hover:shadow-card"
                >
                  <div className="flex items-start gap-3.5">
                    <Avatar name={post.author} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-display text-[15px] font-bold text-ink">
                          {post.author}
                        </span>
                        <span className="text-ink-faint">·</span>
                        <span className="text-[13px] text-ink-mute">{post.timestamp}</span>
                      </div>
                      <Badge variant="lilac" className="mt-1.5">
                        {post.communityName}
                      </Badge>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                    {renderContentWithHashtags(post.content)}
                  </p>

                  {post.files && post.files.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {(() => {
                        const images = post.files.filter((f) => f.type.startsWith("image/"))
                        const pdfs = post.files.filter((f) => f.type === "application/pdf")
                        return (
                          <>
                            {images.length > 0 && <ImageCarousel images={images} postId={post.id} />}
                            {pdfs.map((pdf, pdfIndex) => (
                              <PDFPreview
                                key={pdfIndex}
                                pdf={pdf}
                                postId={post.id}
                                pdfIndex={pdfIndex}
                                onPageClick={(page, numPages) =>
                                  setPdfModal({
                                    isOpen: true,
                                    pdfUrl: pdf.url,
                                    pdfName: pdf.name,
                                    page,
                                    numPages,
                                  })
                                }
                              />
                            ))}
                          </>
                        )
                      })()}
                    </div>
                  )}

                  {/* ---------- Reaction summary — top 3 reaction types as stacked icons
                       + total, same idea as Facebook/Instagram's reaction cluster ---------- */}
                  {total > 0 && (
                    <div className="mt-4 flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {top.map((r) => (
                          <span
                            key={r.id}
                            className={`grid h-5 w-5 place-items-center rounded-full border-2 border-surface ${r.bg}`}
                          >
                            <r.icon className={`h-3 w-3 ${r.color}`} />
                          </span>
                        ))}
                      </div>
                      <span className="text-[13px] text-ink-mute">{total}</span>
                    </div>
                  )}

                  {/* ---------- Actions ---------- */}
                  <div className="mt-3 flex items-center gap-1 border-t border-line pt-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowReactionPicker(showReactionPicker === post.id ? null : post.id)
                        }
                        className={`flex items-center gap-2 rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors hover:bg-surface-sunken ${
                          userReaction ? (REACTIONS.find((r) => r.id === userReaction)?.color ?? "text-ink-soft") : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        {(() => {
                          const reaction = REACTIONS.find((r) => r.id === userReaction)
                          const Icon = reaction?.icon || ThumbsUp
                          return <Icon className="h-4 w-4" />
                        })()}
                        <span>{userReaction ? REACTIONS.find((r) => r.id === userReaction)?.label : "React"}</span>
                      </button>

                      {showReactionPicker === post.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-full left-0 z-10 mb-2 flex gap-1 rounded-2xl border border-line bg-surface p-2 shadow-card"
                        >
                          {REACTIONS.map((reaction) => {
                            const Icon = reaction.icon
                            return (
                              <button
                                key={reaction.id}
                                type="button"
                                onClick={() => handleReaction(post.id, reaction.id)}
                                title={reaction.label}
                                className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-surface-sunken"
                              >
                                <Icon className={`h-5 w-5 ${reaction.color}`} />
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowComments({ ...showComments, [post.id]: !showComments[post.id] })
                      }
                      className="flex items-center gap-2 rounded-full px-3 py-2 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* ---------- Comments ---------- */}
                  <AnimatePresence>
                    {showComments[post.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4 border-t border-line pt-4">
                          {post.comments.map((comment) => {
                            const commentKey = `${post.id}:${comment.id}`
                            const commentLiked = !!likedComments[commentKey]
                            const commentLikeCount = comment.likes + (commentLiked ? 1 : 0)

                            return (
                              <div key={comment.id}>
                                <CommentRow
                                  author={comment.author}
                                  content={comment.content}
                                  timestamp={comment.timestamp}
                                  liked={commentLiked}
                                  likeCount={commentLikeCount}
                                  onLike={() => toggleCommentLike(commentKey)}
                                  onReply={() => openReplyBox(post.id, comment.id)}
                                />

                                {/* ---------- Nested replies ---------- */}
                                {comment.replies.length > 0 && (
                                  <div className="ml-11 mt-2 space-y-3 border-l-2 border-line pl-4">
                                    {comment.replies.map((reply) => {
                                      const replyKey = `${post.id}:${comment.id}:${reply.id}`
                                      const replyLiked = !!likedComments[replyKey]
                                      const replyLikeCount = reply.likes + (replyLiked ? 1 : 0)
                                      return (
                                        <CommentRow
                                          key={reply.id}
                                          author={reply.author}
                                          content={reply.content}
                                          timestamp={reply.timestamp}
                                          liked={replyLiked}
                                          likeCount={replyLikeCount}
                                          onLike={() => toggleCommentLike(replyKey)}
                                          onReply={() => openReplyBox(post.id, comment.id)}
                                          small
                                        />
                                      )
                                    })}
                                  </div>
                                )}

                                {/* ---------- Inline reply box, right under this comment ---------- */}
                                {replyingTo === commentKey && (
                                  <div className="ml-11 mt-2 flex gap-2">
                                    <Avatar name="Alex Johnson" size="sm" />
                                    <div className="flex flex-1 gap-2">
                                      <input
                                        type="text"
                                        placeholder={`Reply to ${comment.author}…`}
                                        value={replyInputs[commentKey] || ""}
                                        ref={(el) => {
                                          replyInputRefs.current[commentKey] = el
                                        }}
                                        onChange={(e) =>
                                          setReplyInputs((prev) => ({ ...prev, [commentKey]: e.target.value }))
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleAddReply(post.id, comment.id)
                                          if (e.key === "Escape") setReplyingTo(null)
                                        }}
                                        className="h-9 flex-1 rounded-full border border-line-strong bg-surface px-4 text-[13.5px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                                      />
                                      <Button
                                        size="icon-sm"
                                        onClick={() => handleAddReply(post.id, comment.id)}
                                        disabled={!replyInputs[commentKey]?.trim()}
                                        aria-label="Send reply"
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}

                          {/* ---------- Top-level comment box ---------- */}
                          <div className="flex gap-3">
                            <Avatar name="Alex Johnson" size="sm" />
                            <div className="flex flex-1 gap-2">
                              <input
                                type="text"
                                placeholder="Write a comment…"
                                value={commentInputs[post.id] || ""}
                                onChange={(e) =>
                                  setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                                }
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                                className="h-10 flex-1 rounded-full border border-line-strong bg-surface px-4 text-[14px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                              />
                              <Button
                                size="icon-sm"
                                onClick={() => handleAddComment(post.id)}
                                disabled={!commentInputs[post.id]?.trim()}
                                aria-label="Send comment"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              )
            })}
          </div>

          {/* ===================== Sidebar ===================== */}
          <aside className="space-y-5 lg:col-span-4">
            {/* ---------- My communities ---------- */}
            <Reveal delay={0.06}>
              <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[16px] font-bold text-ink">Your communities</h2>
                  <Link
                    href="/explore"
                    className="text-[13px] font-semibold text-ink-mute transition-colors hover:text-ink"
                  >
                    Explore
                  </Link>
                </div>
                <div className="mt-4 space-y-1">
                  {myCommunitiesData.map((community) => (
                    <div
                      key={community.id}
                      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-surface-sunken"
                    >
                      <Avatar name={community.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink">
                          {community.name}
                        </p>
                        <p className="text-[12.5px] text-ink-mute">{community.members} members</p>
                      </div>
                      {community.unreadPosts > 0 && (
                        <Badge variant="accent">{community.unreadPosts}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* ---------- Suggested ---------- */}
            <Reveal delay={0.1}>
              <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <h2 className="font-display text-[16px] font-bold text-ink">Suggested for you</h2>
                <div className="mt-4 space-y-2">
                  {suggestedCommunities.map((community) => (
                    <div
                      key={community.id}
                      className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-surface-sunken"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-surface-sunken text-lg">
                        {community.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink">
                          {community.name}
                        </p>
                        <p className="text-[12.5px] text-ink-mute">{community.members} members</p>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          community.membershipStatus === "member"
                            ? "accent"
                            : community.membershipStatus === "pending"
                              ? "secondary"
                              : "default"
                        }
                        onClick={() => handleSuggestedButtonClick(community)}
                      >
                        {community.membershipStatus === "member"
                          ? "Joined"
                          : community.membershipStatus === "pending"
                            ? "Pending"
                            : community.isPublic
                              ? "Join"
                              : "Request"}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
                  <Link href="/explore">See all communities</Link>
                </Button>
              </section>
            </Reveal>

            {/* ---------- Trending ---------- */}
            <Reveal delay={0.14}>
              <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <h2 className="flex items-center gap-2 font-display text-[16px] font-bold text-ink">
                  <TrendingUp className="h-4 w-4 text-pulse" />
                  Trending topics
                </h2>
                <div className="mt-4 space-y-1">
                  {trendingTopics.map((topic, index) => (
                    <button
                      key={topic.tag}
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-surface-sunken"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-4 text-[13px] font-bold text-ink-faint">{index + 1}</span>
                        <span className="text-[14px] font-medium text-ink">{topic.tag}</span>
                      </span>
                      <span className="text-[12.5px] text-ink-mute">{topic.posts}</span>
                    </button>
                  ))}
                </div>
              </section>
            </Reveal>
          </aside>
        </div>
      </main>

      {/* ===================== Create community modal ===================== */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-line bg-surface p-7 shadow-lift"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-ink">
                    Create a community
                  </h2>
                  <p className="mt-1 text-[14px] text-ink-mute">
                    One subject, one room. Keep the name obvious.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-surface-sunken hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="community-name" className="text-[14px] font-medium text-ink">
                    Name
                  </label>
                  <input
                    id="community-name"
                    value={newCommunityName}
                    onChange={(e) => setNewCommunityName(e.target.value)}
                    placeholder="Advanced Calculus Study Group"
                    className="h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="community-subject" className="text-[14px] font-medium text-ink">
                    Subject
                  </label>
                  <input
                    id="community-subject"
                    value={newCommunitySubject}
                    onChange={(e) => setNewCommunitySubject(e.target.value)}
                    placeholder="Mathematics"
                    className="h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="community-desc" className="text-[14px] font-medium text-ink">
                    Description
                  </label>
                  <textarea
                    id="community-desc"
                    value={newCommunityDescription}
                    onChange={(e) => setNewCommunityDescription(e.target.value)}
                    placeholder="What happens here, and who is it for?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-line-strong bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                  />
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-sunken">
                    {communityPhotoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={communityPhotoPreview} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-ink-faint" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCommunityPhotoUpload}
                      className="hidden"
                      id="community-photo"
                    />
                    <label htmlFor="community-photo" className="cursor-pointer">
                      <Button type="button" variant="secondary" size="sm" asChild>
                        <span>Upload cover</span>
                      </Button>
                    </label>
                    <p className="mt-1.5 text-[12.5px] text-ink-mute">Optional</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPublicCommunity(true)}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-left transition-colors ${
                      isPublicCommunity
                        ? "border-ink bg-surface"
                        : "border-line bg-surface hover:border-line-strong"
                    }`}
                  >
                    <span className="block font-display text-[14px] font-bold text-ink">Open</span>
                    <span className="block text-[12.5px] text-ink-mute">Anyone can join</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublicCommunity(false)}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-left transition-colors ${
                      !isPublicCommunity
                        ? "border-ink bg-surface"
                        : "border-line bg-surface hover:border-line-strong"
                    }`}
                  >
                    <span className="block font-display text-[14px] font-bold text-ink">
                      By request
                    </span>
                    <span className="block text-[12.5px] text-ink-mute">You approve members</span>
                  </button>
                </div>
              </div>

              <div className="mt-7 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateCommunity}>
                  Create community
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===================== Leave / cancel dialog ===================== */}
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
                  ? `Are you sure you want to cancel your request to join "${confirmAction.name}"?`
                  : `Are you sure you want to leave "${confirmAction.name}"?`}
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

      {pdfModal && (
        <PDFViewerModal
          isOpen={pdfModal.isOpen}
          pdfUrl={pdfModal.pdfUrl}
          pdfName={pdfModal.pdfName}
          initialPage={pdfModal.page}
          numPages={pdfModal.numPages}
          onClose={() => setPdfModal(null)}
        />
      )}
    </div>
  )
}

function CommentRow({
  author,
  content,
  timestamp,
  liked,
  likeCount,
  onLike,
  onReply,
  small,
}: {
  author: string
  content: string
  timestamp: string
  liked: boolean
  likeCount: number
  onLike: () => void
  onReply: () => void
  small?: boolean
}) {
  return (
    <div className="flex gap-3">
      <Avatar name={author} size="sm" />
      <div className="flex-1">
        <div className={`rounded-2xl bg-surface-sunken px-4 ${small ? "py-2" : "py-3"}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13.5px] font-semibold text-ink">{author}</span>
            <span className="text-[12.5px] text-ink-mute">{timestamp}</span>
          </div>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{content}</p>
        </div>
        <div className="mt-1 ml-1 flex items-center gap-3">
          <button
            type="button"
            onClick={onLike}
            className={`flex items-center gap-1 text-[12.5px] font-semibold transition-colors ${
              liked ? "text-pulse-dark" : "text-ink-mute hover:text-ink"
            }`}
          >
            <ThumbsUp className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
            Like{likeCount > 0 ? ` · ${likeCount}` : ""}
          </button>
          <button
            type="button"
            onClick={onReply}
            className="text-[12.5px] font-semibold text-ink-mute transition-colors hover:text-ink"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}