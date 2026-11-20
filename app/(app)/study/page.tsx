"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Search, Loader2, Plus, X, Target } from 'lucide-react'
import { showToast } from "@/lib/toast-helper"
import { SortableItem } from "@/components/drag-drop/sortable-item"
import { FileUploadZone } from "@/components/drag-drop/file-upload-zone"
import { usePiP } from "@/contexts/pip-context"
import { CustomSelect } from "@/components/ui/custom-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Paperclip, ChevronDown, ArrowLeft, ArrowRight, Check, Clock3, UsersRound } from "lucide-react"
import { LiveActivityFeed } from "@/components/realtime/live-activity-feed"
import { SharedWhiteboard } from "@/components/realtime/shared-whiteboard"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

/** default work interval in minutes */
const WORK_MINUTES = 25
const BREAK_MINUTES = 5

type StudyPhase = 'setup' | 'searching' | 'session'
type TimerMode = 'work' | 'break'

interface StudyGoal {
  id: string
  text: string
}

function LobbyHeading({ icon: Icon, title, description }: { icon: typeof BookOpen; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-sunken text-pulse-dark">
        <Icon className="size-4" strokeWidth={1.8} />
      </span>
      <div>
        <h2 className="font-display text-base font-bold tracking-tight text-ink">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-ink-soft">{description}</p>
      </div>
    </div>
  )
}

export default function StudyPage() {
  const router = useRouter()
  
  // Study session state
  const [phase, setPhase] = useState<StudyPhase>('setup')
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Setup form state
  const [subject, setSubject] = useState("")
  const [duration, setDuration] = useState("25")
  const workMinutes = Number(duration) || WORK_MINUTES
  const [topic, setTopic] = useState("")
  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search)
    const requestedSubject = parameters.get("subject")
    if (requestedSubject && ["Mathematics", "Biology", "History", "Physics", "Chemistry", "English", "Computer Science"].includes(requestedSubject)) {
      setSubject(requestedSubject)
      setTopic((parameters.get("topic") || "").slice(0, 120))
    }
  }, [])
  const [materialCount, setMaterialCount] = useState(0)
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([])
  const [newGoal, setNewGoal] = useState("")
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [partnerCameraOn] = useState(true) // Partner's camera state
  const [partnerMicOn] = useState(true) // Partner's mic state
  const [activeTab, setActiveTab] = useState<'timer' | 'whiteboard' | 'activity'>('timer')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChatInFullscreen, setShowChatInFullscreen] = useState(false)
  const [mainCameraIsPartner, setMainCameraIsPartner] = useState(true)
  const [timerMode, setTimerMode] = useState<TimerMode>('work')
  const [savedWorkProgress, setSavedWorkProgress] = useState<number | null>(null)
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null)
  const [showMatchCard, setShowMatchCard] = useState(false)
  
  // Global PiP context
  const { activatePiP, deactivatePiP, updatePiPData, isPiPActive } = usePiP()

  // Loading states
  const [isStartingSession, setIsStartingSession] = useState(false)

  // Partner state
  const [partner] = useState({
    name: "Alex",
    subject: "Mathematics",
    avatar: "/partner-avatar.png",
    major: "Computer Science",
    year: "Junior",
  })

  // Searching state
  const [, setSearchProgress] = useState(0)

  // Chat state
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'you' | 'partner'; timestamp: Date }>>([])
  const [messageInput, setMessageInput] = useState("")

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )


  // Timer effect with break transitions
  useEffect(() => {
    if (running && phase === 'session') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setRunning(false)
            if (intervalRef.current) clearInterval(intervalRef.current)
            
            // Transition between work and break
            if (timerMode === 'work') {
              // Work session complete - no saved progress needed
              setSavedWorkProgress(null)
              setTimerMode('break')
              setSecondsLeft(BREAK_MINUTES * 60)
              showToast.success('Work Session Complete!', 'Time for a 5-minute break 🎉')
              // Play sound
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKjo77RgGwU7k9n1y34qBSF1xe/glEILElyx6OyrWBUIRp/h8r1rIAUsgs/z2og1CBtpvO/knE0MDk+n6O+zYBoFOpPZ9cx+KgUgdcXv4JRCCxFbsvDtrFgVB0ag4PK9aiAFLILP89qINQgcab3v5ZxNDA5Pp+jvs2AaBTqT2fXMfioFIHXF7+CUQgsRW7Lw7axYFQdGoODyvWogBSyCz/PaiDUIHGm97+WcTQwOT6fo77NgGgU6k9n1zH4qBSB1xe/glEILEVuy8O2sWBUHRqDg8r1qIAUsgr')
              audio.play().catch(() => {})
            } else {
              // Break over - restore saved work progress or start fresh
              setTimerMode('work')
              setSecondsLeft(savedWorkProgress ?? workMinutes * 60)
              setSavedWorkProgress(null)
              showToast.info('Break Over', 'Ready to continue studying?')
            }
            
            return timerMode === 'work' ? BREAK_MINUTES * 60 : (savedWorkProgress ?? workMinutes * 60)
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, phase, timerMode, savedWorkProgress, workMinutes])

  // Search simulation effect
  useEffect(() => {
    if (phase === 'searching' && !showMatchCard) {
      const searchInterval = setInterval(() => {
        setSearchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(searchInterval)
            setShowMatchCard(true)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(searchInterval)
    }
  }, [phase, showMatchCard])


  // Timer helpers
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const seconds = String(secondsLeft % 60).padStart(2, "0")

  // Update PiP data when timer changes
  useEffect(() => {
    if (isPiPActive && phase === 'session') {
      const activeGoalText = activeGoalId ? studyGoals.find(g => g.id === activeGoalId)?.text : undefined
      updatePiPData({
        timerMinutes: minutes,
        timerSeconds: seconds,
        activeGoal: activeGoalText,
        userCameraOn: cameraOn,
        userMicOn: micOn,
        partnerCameraOn,
        partnerMicOn,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes, seconds, activeGoalId, cameraOn, micOn, partnerCameraOn, partnerMicOn, isPiPActive, phase])

  // Timer handlers
  const startTimer = () => {
    setRunning(true)
  }
  
  const pauseTimer = () => {
    setRunning(false)
    // No toast - button state is clear
  }
  
  const resetTimer = () => {
    setRunning(false)
    setTimerMode('work')
    setSecondsLeft(workMinutes * 60)
  }

  const skipBreak = () => {
    setTimerMode('work')
    // Restore saved work progress or start fresh
    setSecondsLeft(savedWorkProgress ?? workMinutes * 60)
    setRunning(false)
    showToast.quick('Break Skipped')
    setSavedWorkProgress(null)
  }

  const takeBreak = () => {
    // Save current work progress before switching to break
    if (timerMode === 'work') {
      setSavedWorkProgress(secondsLeft)
    }
    setTimerMode('break')
    setSecondsLeft(BREAK_MINUTES * 60)
    setRunning(false)
    showToast.quick('Break Started')
  }

  // Send message handler
  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        sender: 'you' as const,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setMessageInput("")
    }
  }

  // Handle Enter key to send message
  const handleMessageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  // Form validation
  const isFormValid = Boolean(subject && duration)

  // Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setStudyGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
      
      // Visual feedback is enough for reordering
    }
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal: StudyGoal = {
        id: Date.now().toString(),
        text: newGoal.trim()
      }
      setStudyGoals([...studyGoals, goal])
      setNewGoal("")
      
    }
  }

  const removeGoal = (id: string) => {
    setStudyGoals(studyGoals.filter(goal => goal.id !== id))
    // Visual feedback is enough for removal
  }

  // Start pairing handler
  const handleStartPairing = async () => {
    if (isFormValid) {
      setIsStartingSession(true)
      
      // Simulate form processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSearchProgress(0)
      setShowMatchCard(false)
      setTimerMode('work')
      setSecondsLeft(workMinutes * 60)
      setSavedWorkProgress(null)
      setActiveGoalId(null)
      setPhase('searching')
      setIsStartingSession(false)
      
      // No toast needed - the full-screen search UI is clear enough
    }
  }

  // Back to setup handler
  const handleBackToSetup = () => {
    const wasInSession = phase === 'session'
    setShowMatchCard(false)
    setPhase('setup')
    setRunning(false)
    setSecondsLeft(workMinutes * 60)
    setTimerMode('work')
    setSavedWorkProgress(null)
    setSearchProgress(0)
    deactivatePiP()
    
    if (wasInSession) showToast.info("Session ended", "You're back in your session lobby.")
  }

  const handleActivatePiP = () => {
    activatePiP({
      partnerName: partner.name,
      timerMinutes: minutes,
      timerSeconds: seconds,
      activeGoal: activeGoalId ? studyGoals.find(g => g.id === activeGoalId)?.text : undefined,
      userCameraOn: cameraOn,
      userMicOn: micOn,
      partnerCameraOn,
      partnerMicOn,
      onUserCameraToggle: handleCameraToggle,
      onUserMicToggle: handleMicToggle,
      onFullscreen: () => {
        router.push('/study')
        setTimeout(() => setIsFullscreen(true), 200)
      },
      onEndSession: handleBackToSetup,
    })
  }

  // Media toggle handlers
  const handleCameraToggle = () => {
    setCameraOn(!cameraOn)
  }

  const handleMicToggle = () => {
    setMicOn(!micOn)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-paper overflow-x-hidden">
        
        {/* Live Cursors for real-time collaboration */}
        

        <main className="container-page flex w-full max-w-6xl flex-1 flex-col gap-6 py-10 sm:py-14 lg:flex-row">
          {/* Left Column - Main Content */}
          <section className={`flex min-w-0 flex-1 flex-col ${phase === 'session' ? "lg:max-w-[600px]" : "w-full"}`}>
            
            {/* Setup Phase */}
            <AnimatePresence mode="wait">
              {phase === 'setup' && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <header className="mb-8">
                    <p className="eyebrow">Focus room</p>
                    <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[40px]">Good work starts together.</h1>
                    <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink-soft">Choose a subject, set your pace, and find someone to study alongside.</p>
                  </header>

                  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="min-w-0 space-y-5">
                      <Card>
                        <CardContent className="space-y-6 p-5 sm:p-6">
                          <LobbyHeading icon={BookOpen} title="What are you working on?" description="Start with a subject. A topic helps make your intentions clearer." />
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="session-subject">Subject</Label>
                              <CustomSelect id="session-subject" value={subject} onChange={setSubject} placeholder="Choose a subject" options={["Mathematics", "Biology", "History", "Physics", "Chemistry", "English", "Computer Science"].map(value => ({ value, label: value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="session-topic">Topic <span className="font-normal text-ink-mute">· optional</span></Label>
                              <Input id="session-topic" value={topic} onChange={event => setTopic(event.target.value)} placeholder="e.g. Integration by parts" maxLength={120} />
                            </div>
                          </div>
                          <fieldset>
                            <legend className="mb-3 text-sm font-medium text-ink-soft">Focus duration</legend>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                              {[25, 45, 60, 90, 120].map(value => (
                                <button key={value} type="button" aria-pressed={duration === String(value)} onClick={() => setDuration(String(value))}
                                  className={`rounded-xl border px-2 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse ${duration === String(value) ? "border-pulse bg-pulse-soft text-pulse-dark" : "border-line bg-surface hover:bg-surface-sunken text-ink-soft"}`}>
                                  <span className="block text-base font-bold tabular-nums">{value === 120 ? "2" : value}<span className="ml-1 text-xs font-normal">{value === 120 ? "hr" : "min"}</span></span>
                                  {value === 25 && <span className="mt-1 block text-[10px]">Pomodoro</span>}
                                </button>
                              ))}
                            </div>
                            <p className="mt-3 text-xs leading-5 text-ink-mute">A 5-minute break follows your focus interval.</p>
                          </fieldset>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="space-y-5 p-5 sm:p-6">
                          <LobbyHeading icon={Target} title="A little intention" description="Add a goal or two, or decide together once you're paired. Optional." />
                          {studyGoals.length > 0 && (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                              <SortableContext items={studyGoals} strategy={verticalListSortingStrategy}>
                                <ul className="space-y-2">
                                  {studyGoals.map(goal => (
                                    <li key={goal.id}>
                                      <SortableItem id={goal.id} className="rounded-xl border border-line bg-surface-sunken px-3 py-2">
                                        <div className="flex min-w-0 items-center justify-between gap-2">
                                          <span className="break-words text-sm leading-6 text-ink-soft">{goal.text}</span>
                                          <Button variant="ghost" size="icon-sm" onClick={() => removeGoal(goal.id)} aria-label={`Remove goal: ${goal.text}`}><X className="size-3.5" /></Button>
                                        </div>
                                      </SortableItem>
                                    </li>
                                  ))}
                                </ul>
                              </SortableContext>
                            </DndContext>
                          )}
                          <form onSubmit={event => { event.preventDefault(); addGoal() }} className="flex items-center gap-2">
                            <Input aria-label="New study goal" value={newGoal} onChange={event => setNewGoal(event.target.value)} placeholder="What would you like to finish?" maxLength={200} className="min-w-0" />
                            <Button type="submit" variant="secondary" size="icon" disabled={!newGoal.trim()} aria-label="Add study goal"><Plus className="size-4" /></Button>
                          </form>
                          <p className="text-xs leading-5 text-ink-mute">Try “Solve three practice problems” or “Review chapter 4”. Drag goals to reorder.</p>
                        </CardContent>
                      </Card>

                      <details className="group rounded-3xl border border-line bg-surface shadow-soft">
                        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-3xl p-5 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse sm:p-6 [&::-webkit-details-marker]:hidden">
                          <Paperclip className="size-4 text-ink-mute" strokeWidth={1.8} />
                          Study materials <span className="text-xs font-normal text-ink-mute">Optional</span>
                          <ChevronDown className="ml-auto size-4 text-ink-mute transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-line p-5 sm:p-6">
                          <p className="mb-4 text-xs leading-5 text-ink-soft">Prepare notes or exercises for your session. File sharing will be available when live sessions are connected.</p>
                          <FileUploadZone onFilesUploaded={files => setMaterialCount(files.length)} />
                        </div>
                      </details>
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-24">
                      <Card className="overflow-hidden">
                        <CardContent className="space-y-5 p-5 sm:p-6">
                          <LobbyHeading icon={Video} title="Join your way" description="Camera and microphone are always your choice." />
                          <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-line bg-surface-sunken">
                            <Avatar name="You" size="lg" />
                            <p className="mt-3 text-xs font-medium text-ink-soft">{cameraOn ? "Ready for video" : "Camera off"}</p>
                            <span className="absolute bottom-3 left-3 text-[10px] text-ink-mute">Session preview · devices not connected</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant={cameraOn ? "subtle" : "secondary"} onClick={handleCameraToggle} aria-pressed={cameraOn} className="px-3 text-xs">
                              {cameraOn ? <Video className="size-3.5" /> : <VideoOff className="size-3.5" />} Camera {cameraOn ? "on" : "off"}
                            </Button>
                            <Button variant={micOn ? "subtle" : "secondary"} onClick={handleMicToggle} aria-pressed={micOn} className="px-3 text-xs">
                              {micOn ? <Mic className="size-3.5" /> : <MicOff className="size-3.5" />} Mic {micOn ? "on" : "off"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-5 sm:p-6">
                          <p className="eyebrow">Your session</p>
                          <h2 className="mt-2 break-words font-display text-xl font-bold tracking-tight text-ink">{subject || "Choose your subject"}</h2>
                          {topic.trim() && <p className="mt-1 break-words text-sm text-ink-soft">{topic}</p>}
                          <dl className="my-5 space-y-3 border-y border-line py-4 text-xs">
                            <div className="flex justify-between gap-3"><dt className="text-ink-mute">Focus interval</dt><dd className="font-medium text-ink">{duration} minutes</dd></div>
                            <div className="flex justify-between gap-3"><dt className="text-ink-mute">Study goals</dt><dd className="font-medium text-ink">{studyGoals.length || "Decide together"}</dd></div>
                            <div className="flex justify-between gap-3"><dt className="text-ink-mute">Materials prepared</dt><dd className="font-medium text-ink">{materialCount || "None yet"}</dd></div>
                          </dl>
                          <Button onClick={handleStartPairing} variant="accent" loading={isStartingSession} disabled={!isFormValid} className="w-full">
                            {!isStartingSession && <Search className="size-4" strokeWidth={1.8} />}
                            {isStartingSession ? "Preparing…" : "Find a study partner"}
                          </Button>
                          <p className="mt-3 text-center text-xs leading-5 text-ink-mute">{subject ? "Review your match before joining." : "Choose a subject to get started."}</p>
                          <p className="mt-3 text-center text-[11px] text-ink-mute">Preview mode · pairing is currently simulated</p>
                        </CardContent>
                      </Card>
                    </aside>
                  </div>
                </motion.div>
              )}

              {/* Search and match share one page, without a modal or notification. */}
              {phase === 'searching' && (
                <motion.div key="searching" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto w-full max-w-xl py-4 sm:py-10">
                  <Button variant="ghost" size="sm" onClick={handleBackToSetup} className="mb-6 gap-2">
                    <ArrowLeft className="size-3.5" /> Back to setup
                  </Button>
                  <div className="mb-6">
                    <p className="eyebrow">Find your focus</p>
                    <h1 className="mt-2 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[36px]">
                      {showMatchCard ? "A study partner for you." : "Finding your study partner."}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-ink-soft">
                      {showMatchCard ? "Take a look, then decide if you'd like to study together." : "We're looking for someone working on the same subject. You can head back and change your preferences anytime."}
                    </p>
                  </div>
                  <AnimatePresence mode="wait">
                    {!showMatchCard ? (
                      <motion.div key="looking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
                        <Card>
                          <CardContent className="p-6 text-center sm:p-8">
                            <div className="mx-auto mb-6 flex items-center justify-center gap-4" aria-hidden="true">
                              <Avatar name="You" size="lg" />
                              <span className="grid size-10 place-items-center rounded-full bg-pulse-soft text-pulse-dark">
                                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={1.8} />
                              </span>
                              <span className="grid size-14 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-ink-mute">
                                <UsersRound className="size-5" strokeWidth={1.6} />
                              </span>
                            </div>
                            <h2 className="font-display text-lg font-bold text-ink">Looking for a good study fit</h2>
                            <p className="mt-2 text-sm leading-6 text-ink-soft">Your match will appear here when they&apos;re ready.</p>
                            <div className="mt-6 rounded-2xl border border-line bg-surface-sunken p-4 text-left">
                              <p className="break-words text-sm font-semibold text-ink">{subject}</p>
                              {topic.trim() && <p className="mt-1 break-words text-xs text-ink-soft">{topic.trim()}</p>}
                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
                                <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" /> {duration} min focus</span>
                                <span className="inline-flex items-center gap-1.5">{cameraOn ? <Video className="size-3.5" /> : <VideoOff className="size-3.5" />} Camera {cameraOn ? "on" : "off"}</span>
                                <span className="inline-flex items-center gap-1.5">{micOn ? <Mic className="size-3.5" /> : <MicOff className="size-3.5" />} Mic {micOn ? "on" : "off"}</span>
                              </div>
                            </div>
                            <Button variant="outline" onClick={handleBackToSetup} className="mt-6">Cancel search</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div key="match" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
                        <Card className="overflow-hidden">
                          <div className="flex items-center gap-2 border-b border-line bg-pulse-soft px-6 py-3 text-xs font-semibold text-pulse-dark">
                            <Check className="size-3.5" strokeWidth={2} /> Match found
                          </div>
                          <CardContent className="space-y-6 p-6 sm:p-8">
                            <div className="flex items-center gap-4">
                              <Avatar name={partner.name} size="lg" />
                              <div>
                                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">{partner.name}</h2>
                                <p className="mt-1 text-xs leading-5 text-ink-soft">{partner.major} · {partner.year}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-2xl border border-line bg-surface-sunken p-4">
                              <div>
                                <p className="text-[11px] font-medium text-ink-mute">Shared subject</p>
                                <p className="mt-1 break-words text-sm font-semibold text-ink">{subject}</p>
                              </div>
                              <div className="border-l border-line pl-4">
                                <p className="text-[11px] font-medium text-ink-mute">Focus interval</p>
                                <p className="mt-1 text-sm font-semibold text-ink">{duration} min</p>
                              </div>
                            </div>
                            <div>
                              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-ink"><Target className="size-3.5 text-pulse-dark" strokeWidth={1.8} /> Your session plan</p>
                              {topic.trim() && <p className="mb-3 break-words text-sm text-ink-soft">{topic.trim()}</p>}
                              {studyGoals.length > 0 ? (
                                <ul className="space-y-2">
                                  {studyGoals.map(goal => <li key={goal.id} className="flex items-start gap-2 text-sm leading-6 text-ink-soft"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-pulse" /><span className="min-w-0 break-words">{goal.text}</span></li>)}
                                </ul>
                              ) : <p className="text-sm leading-6 text-ink-soft">Start with a quick introduction and choose a goal together.</p>}
                            </div>
                            <p className="rounded-xl bg-surface-sunken p-3 text-xs leading-5 text-ink-soft">You&apos;ll join with your camera {cameraOn ? "on" : "off"} and microphone {micOn ? "on" : "off"}. You can change either during the session.</p>
                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                              <Button variant="outline" onClick={() => { setSearchProgress(0); setShowMatchCard(false) }} className="flex-1">Find someone else</Button>
                              <Button variant="accent" onClick={() => { setShowMatchCard(false); setPhase('session') }} className="flex-1">Join session <ArrowRight className="size-3.5" /></Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="mt-5 text-center text-[11px] text-ink-mute">Preview mode · pairing is currently simulated</p>
                </motion.div>
              )}

              {/* Session Phase */}
              {phase === 'session' && (
                <motion.div
                  key="session"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Partner Info */}
                  <Card className="mb-6 border-line bg-surface">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={partner.name} size="md" status="online" />
                          <div>
                            <h3 className="font-display font-bold tracking-[-0.02em] text-ink">Studying with {partner.name}</h3>
                            <p className="text-sm text-ink-soft">{subject} • {duration} minutes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  <h2 className="px-4 pt-2 pb-3 text-left font-display text-[26px] font-extrabold tracking-[-0.035em] text-ink">Session</h2>

                  {/* Tabs for Timer/Whiteboard/Activity */}
                  <div className="mb-6 inline-flex gap-1 rounded-full border border-line bg-surface-sunken p-1">
                    {([
                      { id: 'timer', label: 'Timer' },
                      { id: 'whiteboard', label: 'Whiteboard' },
                      { id: 'activity', label: 'Activity' },
                    ] as const).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 font-display text-[13.5px] font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'bg-surface text-ink shadow-soft'
                            : 'text-ink-mute hover:text-ink'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Timer Tab */}
                  {activeTab === 'timer' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4"
                    >
                      {/* Timer Mode Indicator */}
                      <div className="text-center mb-3">
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                          timerMode === 'work' 
                            ? 'bg-pulse-soft text-pulse-dark' 
                            : 'bg-lemon text-lemon-deep'
                        }`}>
                          {timerMode === 'work' ? 'Focus Time' : 'Break Time'}
                        </span>
                      </div>

                      {/* Compact Timer Display */}
                      <div className="flex gap-3 justify-center mb-4">
                        <div className="text-center">
                          <div className={`rounded-2xl px-6 py-4 min-w-[104px] ${
                            timerMode === 'work' ? 'bg-surface-sunken' : 'bg-lemon/60'
                          }`}>
                            <p className={`text-[44px] font-extrabold leading-none tracking-tight ${
                              timerMode === 'work' ? 'text-ink' : 'text-lemon-deep'
                            }`}>{minutes}</p>
                          </div>
                          <p className="text-xs text-ink-soft mt-1">Minutes</p>
                        </div>
                        <div className="flex items-center text-2xl font-bold text-ink-faint">:</div>
                        <div className="text-center">
                          <div className={`rounded-2xl px-6 py-4 min-w-[104px] ${
                            timerMode === 'work' ? 'bg-surface-sunken' : 'bg-lemon/60'
                          }`}>
                            <p className={`text-[44px] font-extrabold leading-none tracking-tight ${
                              timerMode === 'work' ? 'text-ink' : 'text-lemon-deep'
                            }`}>{seconds}</p>
                          </div>
                          <p className="text-xs text-ink-soft mt-1">Seconds</p>
                        </div>
                      </div>

                  {/* Timer Controls */}
                  <div className="flex justify-center">
                    <div className="flex max-w-[480px] flex-1 flex-wrap justify-center gap-3 px-4 py-3">
                      <Button
                          onClick={running ? pauseTimer : startTimer}
                          className="w-full" style={{ fontWeight: 600 }}
                        >
                          {running ? 'Pause' : 'Start'}
                        </Button>
                      <Button
                          onClick={resetTimer}
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Reset
                        </Button>
                      {timerMode === 'break' ? (
                        <Button
                          onClick={skipBreak}
                          variant="outline"
                          className="w-full border-pulse text-pulse-dark hover:bg-pulse-soft"
                        >
                          Skip Break
                        </Button>
                      ) : (
                        <Button
                          onClick={takeBreak}
                          variant="outline"
                          className="w-full border-pulse text-pulse-dark hover:bg-pulse-soft"
                        >
                          Take Break
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <motion.div 
                    className="flex flex-col gap-3 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-base font-medium text-ink">
                      {timerMode === 'work' ? 'Work Progress' : 'Break Progress'}
                    </p>
                    <div className="h-2.5 w-full rounded-full bg-line">
                      <motion.div
                        className={`h-2 rounded-full ${
                          timerMode === 'work' 
                            ? 'bg-ink' 
                            : 'bg-pulse'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, ((
                          (timerMode === 'work' ? workMinutes : BREAK_MINUTES) * 60 - secondsLeft
                        ) / (
                          (timerMode === 'work' ? workMinutes : BREAK_MINUTES) * 60
                        )) * 100))}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-ink-soft">
                      {Math.max(0, Math.min(100, Math.round(((
                        (timerMode === 'work' ? workMinutes : BREAK_MINUTES) * 60 - secondsLeft
                      ) / (
                        (timerMode === 'work' ? workMinutes : BREAK_MINUTES) * 60
                      )) * 100)))}% completed
                    </p>
                  </motion.div>

                  {/* Study Goals Display - Clickable */}
                  <motion.div 
                    className="px-4 py-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-base font-medium text-ink">Study Goals</p>
                      {running && (
                        <p className="text-xs text-ink-mute">Pause to change</p>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {studyGoals.map((goal) => {
                        const isActive = activeGoalId === goal.id
                        return (
                          <li key={goal.id}>
                            <button
                              onClick={() => !running && setActiveGoalId(isActive ? null : goal.id)}
                              disabled={running}
                              className={`w-full flex items-start gap-2.5 text-sm p-3 rounded-2xl transition-all ${
                                isActive 
                                  ? 'border-2 border-pulse bg-pulse-soft/70' 
                                  : 'border-2 border-transparent bg-surface hover:bg-surface-sunken'
                              } ${
                                running ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                              }`}
                            >
                              <Badge variant="outline" className={`mt-0.5 ${
                                isActive 
                                  ? 'border-pulse bg-pulse text-white' 
                                  : 'border-line bg-surface-sunken text-ink-soft'
                              }`}>
                                {studyGoals.indexOf(goal) + 1}
                              </Badge>
                              <span className={`flex-1 text-left ${
                                isActive ? 'text-ink font-medium' : 'text-ink-soft'
                              }`}>
                                {goal.text}
                              </span>
                              {isActive && running && (
                                <div className="mt-1.5 h-2 w-2 animate-pulse rounded-full bg-pulse"></div>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>

                    </motion.div>
                  )}

                  {/* Whiteboard Tab */}
                  {activeTab === 'whiteboard' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4"
                    >
                      <SharedWhiteboard />
                    </motion.div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4"
                    >
                      <LiveActivityFeed roomId="study-session" />
                    </motion.div>
                  )}

                  {/* End Session Button */}
                  <div className="flex justify-center px-4 py-3">
                    <Button variant="outline" onClick={handleBackToSetup} className="border-rose text-rose-deep hover:bg-rose/40">
                      End Session
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Fullscreen Video Mode */}
          <AnimatePresence>
            {isFullscreen && phase === 'session' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col bg-ink"
              >
                {/* Timer Bar at Top */}
                <div className="flex items-center justify-between bg-ink/80 px-6 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="text-white font-mono text-2xl font-bold">
                      {minutes}:{seconds}
                    </div>
                    <div className="text-ink-mute text-sm">
                      Studying {subject} with {partner.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Timer Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={running ? pauseTimer : startTimer}
                        variant="outline"
                        size="sm"
                        className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                      >
                        {running ? 'Pause' : 'Start'}
                      </Button>
                      <Button
                        onClick={resetTimer}
                        variant="outline"
                        size="sm"
                        className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                      >
                        Reset
                      </Button>
                    </div>
                    
                    <div className="h-6 w-px bg-white/25"></div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setShowChatInFullscreen(!showChatInFullscreen)}
                        variant="outline"
                        size="sm"
                        className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                      >
                        {showChatInFullscreen ? 'Hide' : 'Show'} Chat
                      </Button>
                      <Button
                        onClick={() => setIsFullscreen(false)}
                        variant="outline"
                        size="sm"
                        className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                      >
                        Exit Fullscreen
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Video Grid - Side by Side, Bottom Aligned */}
                <div className="flex-1 flex items-end justify-center px-6 pb-8 gap-6">
                  {/* Main Camera (Large) - Centered */}
                  <div className="flex-1 max-w-4xl">
                    <div className="relative group">
                      <div className="aspect-video flex items-center justify-center rounded-3xl bg-ink/80 ring-1 ring-white/10">
                        {mainCameraIsPartner ? (
                          cameraOn ? (
                            <div className="text-[17px] text-white/45">Partner&apos;s Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-white/45">
                              <VideoOff className="w-16 h-16 mb-3" />
                              <span>{partner.name}&apos;s camera is off</span>
                            </div>
                          )
                        ) : (
                          cameraOn ? (
                            <div className="text-[17px] text-white/45">Your Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-white/45">
                              <VideoOff className="w-16 h-16 mb-3" />
                              <span>Your camera is off</span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-white backdrop-blur-sm">
                        {mainCameraIsPartner ? partner.name : 'You'}
                      </div>
                    </div>
                  </div>

                  {/* Small Camera - Click to switch */}
                  <div className="w-80 flex-shrink-0">
                    <div 
                      className="relative group cursor-pointer hover:ring-4 hover:ring-pulse rounded-lg transition-all"
                      onClick={() => setMainCameraIsPartner(!mainCameraIsPartner)}
                    >
                      <div className="aspect-video flex items-center justify-center rounded-2xl bg-ink/70 ring-1 ring-white/10">
                        {mainCameraIsPartner ? (
                          cameraOn ? (
                            <div className="text-[14px] text-white/45">Your Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-white/45">
                              <VideoOff className="w-8 h-8 mb-1" />
                              <span className="text-xs">Camera off</span>
                            </div>
                          )
                        ) : (
                          cameraOn ? (
                            <div className="text-[14px] text-white/45">Partner&apos;s Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-white/45">
                              <VideoOff className="w-8 h-8 mb-1" />
                              <span className="text-xs">{partner.name}&apos;s camera is off</span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                        {mainCameraIsPartner ? 'You' : partner.name}
                      </div>
                      <div className="absolute top-2 right-2 bg-pulse text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to swap
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls at Bottom - No extra margin */}
                <div className="flex items-center justify-center gap-4 bg-ink/80 px-6 py-4 backdrop-blur-md">
                  <button
                    onClick={handleCameraToggle}
                    className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                      cameraOn 
                        ? 'bg-white/12 hover:bg-white/20' 
                        : 'bg-rose-deep hover:bg-rose-deep/85'
                    }`}
                  >
                    {cameraOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={handleMicToggle}
                    className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                      micOn 
                        ? 'bg-white/12 hover:bg-white/20' 
                        : 'bg-rose-deep hover:bg-rose-deep/85'
                    }`}
                  >
                    {micOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
                  </button>
                  
                  <div className="mx-2 h-8 w-px bg-white/25"></div>
                  
                  <button
                    onClick={() => {
                      setIsFullscreen(false)
                      setTimeout(() => {
                        setPhase('searching')
                        setSearchProgress(0)
                      }, 300)
                    }}
                    className="rounded-full w-14 h-14 flex items-center justify-center transition-colors bg-pulse hover:bg-pulse-dark"
                    title="Skip to find another partner"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 4l10 8-10 8V4z"/>
                      <path d="M19 5v14"/>
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsFullscreen(false)
                      handleBackToSetup()
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-deep transition-colors hover:bg-rose-deep/85"
                    title="End session"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Floating Chat Panel */}
                <AnimatePresence>
                  {showChatInFullscreen && (
                    <motion.div
                      initial={{ x: 400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 400, opacity: 0 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="absolute right-0 top-0 bottom-0 w-96 bg-surface shadow-2xl"
                    >
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-line flex items-center justify-between">
                          <h3 className="font-bold text-ink">Chat with {partner.name}</h3>
                          <Button
                            onClick={() => setShowChatInFullscreen(false)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="h-64 overflow-y-auto bg-surface-sunken p-4">
                          <div className="space-y-3">
                            {messages.map((msg) => (
                              <div key={msg.id} className="text-sm">
                                <span className={`font-medium ${msg.sender === 'you' ? 'text-pulse-dark' : 'text-lilac-deep'}`}>
                                  {msg.sender === 'you' ? 'You' : partner.name}:
                                </span>
                                <span className="ml-2 text-ink-soft">{msg.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border-t border-line">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={handleMessageKeyPress}
                              placeholder="Type a message..."
                              className="h-11 flex-1 rounded-full border border-line-strong bg-surface px-4 text-[14px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                            />
                            <Button onClick={sendMessage} size="sm" className="bg-pulse hover:bg-pulse-dark text-white">Send</Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Column - Video & Chat (only show during session and not fullscreen and not PiP) */}
          <AnimatePresence>
            {phase === 'session' && !isFullscreen && !isPiPActive && (
              <motion.section 
                className="flex flex-1 max-w-[500px] flex-col gap-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                {/* Video Feed - Larger */}
                <Card className="hover:shadow-md transition-shadow border-line flex-1">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-ink">Video Call</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleActivatePiP}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            title="Enable picture-in-picture mode"
                          >
                            PiP
                          </Button>
                          <Button
                            onClick={() => setIsFullscreen(true)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Fullscreen
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {/* Partner's Video */}
                        <div className="relative group">
                          <div className="aspect-video flex items-center justify-center rounded-2xl bg-ink ring-1 ring-white/10 transition-colors duration-200">
                            {cameraOn ? (
                              <div className="text-[14px] text-white/45">Partner&apos;s camera</div>
                            ) : (
                              <div className="flex flex-col items-center text-white/45">
                                <VideoOff className="w-8 h-8 mb-2" />
                                <span className="text-sm">{partner.name}&apos;s camera is off</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-1 text-xs text-white backdrop-blur-sm">
                            {partner.name}
                          </div>
                        </div>

                        {/* Your Video */}
                        <div className="relative group">
                          <div className="aspect-video flex items-center justify-center rounded-2xl bg-ink ring-1 ring-white/10 transition-colors duration-200">
                            {cameraOn ? (
                              <div className="text-[14px] text-white/45">Your camera</div>
                            ) : (
                              <div className="flex flex-col items-center text-white/45">
                                <VideoOff className="w-8 h-8 mb-2" />
                                <span className="text-sm">Your camera is off</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-1 text-xs text-white backdrop-blur-sm">
                            You
                          </div>
                        </div>
                      </div>

                      {/* Media Controls */}
                      <div className="flex gap-2 mt-4">
                        <Button
                            onClick={handleCameraToggle}
                            variant={cameraOn ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                          >
                            {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                          </Button>
                        <Button
                            onClick={handleMicToggle}
                            variant={micOn ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                          >
                            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </Button>
                      </div>
                    </CardContent>
                  </Card>

                {/* Chat - Larger */}
                <Card className="flex-1 hover:shadow-md transition-shadow duration-200 border-line">
                    <CardContent className="p-4 h-full flex flex-col">
                      <h3 className="font-bold text-ink mb-4">Chat with {partner.name}</h3>

                      {/* Chat Messages */}
                      <div className="mb-4 h-48 overflow-y-auto rounded-2xl bg-surface-sunken p-3.5">
                        <div className="space-y-3">
                          {messages.map((msg) => (
                            <div key={msg.id} className="text-sm">
                              <span className={`font-medium ${msg.sender === 'you' ? 'text-pulse-dark' : 'text-lilac-deep'}`}>
                                {msg.sender === 'you' ? 'You' : partner.name}:
                              </span>
                              <span className="ml-2 text-ink-soft">{msg.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleMessageKeyPress}
                          placeholder="Type a message..."
                          className="h-11 flex-1 rounded-full border border-line-strong bg-surface px-4 text-[14px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                        />
                        <Button onClick={sendMessage} size="sm" className="bg-pulse hover:bg-pulse-dark text-white">Send</Button>
                      </div>
                    </CardContent>
                  </Card>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

      </div>
  )
}
