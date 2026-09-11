"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Users, Clock, Search, CheckCircle, Loader2, Plus, X, Maximize2, Target } from 'lucide-react'
import { showToast } from "@/lib/toast-helper"
import { EmptyState } from "@/components/empty-states"
import { SortableItem } from "@/components/drag-drop/sortable-item"
import { FileUploadZone } from "@/components/drag-drop/file-upload-zone"
import { usePiP } from "@/contexts/pip-context"
import { CustomSelect } from "@/components/ui/custom-select"
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

export default function StudyPage() {
  const router = useRouter()
  
  // Study session state
  const [phase, setPhase] = useState<StudyPhase>('setup')
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Setup form state
  const [subject, setSubject] = useState("")
  const [duration, setDuration] = useState("")
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([
    { id: '1', text: 'Review calculus derivatives' },
    { id: '2', text: 'Practice integration problems' },
    { id: '3', text: 'Complete homework exercises' }
  ])
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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
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
    rating: 4.8,
    sessionGoals: ["Review calculus derivatives", "Practice integration problems"],
  })

  // Searching state
  const [searchProgress, setSearchProgress] = useState(0)

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

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission)
        })
      }
    }
  }, [])

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
              setSecondsLeft(savedWorkProgress || WORK_MINUTES * 60)
              setSavedWorkProgress(null)
              showToast.info('Break Over', 'Ready to continue studying?')
            }
            
            return timerMode === 'work' ? BREAK_MINUTES * 60 : WORK_MINUTES * 60
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
  }, [running, phase, timerMode])

  // Search simulation effect
  useEffect(() => {
    if (phase === 'searching') {
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
  }, [phase])

  // Partner found - play sound and browser notification when match card shows
  useEffect(() => {
    if (showMatchCard) {
      // Play subtle notification sound
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)
      oscillator.frequency.value = 600 // Softer frequency
      gainNode.gain.value = 0.15 // Quieter
      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.1) // Shorter
      
      // Show browser notification
      if (notificationPermission === 'granted') {
        new Notification('Study Partner Found! 🎉', {
          body: `You've been matched with ${partner.name} for ${subject}`,
          icon: '/logo.png',
          badge: '/logo.png',
        })
      }
    }
  }, [showMatchCard, partner.name, subject, notificationPermission])

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
    setSecondsLeft(WORK_MINUTES * 60)
  }

  const skipBreak = () => {
    setTimerMode('work')
    // Restore saved work progress or start fresh
    setSecondsLeft(savedWorkProgress || WORK_MINUTES * 60)
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
  const isFormValid = subject && duration && studyGoals.length > 0

  // Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
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
      
      showToast.quick("Goal Added")
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
      setPhase('searching')
      setIsStartingSession(false)
      
      // No toast needed - the full-screen search UI is clear enough
    }
  }

  // Back to setup handler
  const handleBackToSetup = () => {
    setPhase('setup')
    setRunning(false)
    setSecondsLeft(WORK_MINUTES * 60)
    setSearchProgress(0)
    deactivatePiP()
    
    showToast.info("Session Ended", "Great work! Your session has been saved.")
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
    <div className="relative flex min-h-screen flex-col bg-surface overflow-x-hidden">
        <Header />
        
        {/* Live Cursors for real-time collaboration */}
        

        <main className="flex flex-1 gap-6 px-6 py-5">
          {/* Left Column - Main Content */}
          <section className="flex max-w-[600px] flex-1 flex-col">
            
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
                  <h2 className="px-4 pt-5 pb-3 text-left text-3xl font-bold text-ink" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                    Set up your collaborative study session
                  </h2>

                  <div className="space-y-6">
                    {/* Subject Selection */}
                    <div className="px-4">
                      <label className="block text-sm font-medium text-ink-soft mb-2">Subject</label>
                      <CustomSelect
                        value={subject}
                        onChange={setSubject}
                        placeholder="Select subject"
                        options={[
                          { value: "Mathematics", label: "Mathematics" },
                          { value: "Biology", label: "Biology" },
                          { value: "History", label: "History" },
                          { value: "Physics", label: "Physics" },
                          { value: "Chemistry", label: "Chemistry" },
                          { value: "English", label: "English" },
                          { value: "Computer Science", label: "Computer Science" },
                        ]}
                      />
                    </div>

                    {/* Duration Selection */}
                    <div className="px-4">
                      <label className="block text-sm font-medium text-ink-soft mb-2">Duration</label>
                      <CustomSelect
                        value={duration}
                        onChange={setDuration}
                        placeholder="Select duration"
                        options={[
                          { value: "25", label: "25 min (Pomodoro)" },
                          { value: "45", label: "45 min" },
                          { value: "60", label: "60 min" },
                          { value: "90", label: "90 min" },
                          { value: "120", label: "2 hours" },
                        ]}
                      />
                    </div>

                    {/* Draggable Study Goals */}
                    <div className="px-4">
                      <label className="block text-sm font-medium text-ink-soft mb-3">
                        Study Goals (Drag to reorder, shared with partners)
                      </label>
                      
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext items={studyGoals} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2 mb-4">
                            <AnimatePresence>
                              {studyGoals.map((goal) => (
                                <motion.div
                                  key={goal.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <SortableItem
                                    id={goal.id}
                                    className="bg-surface-sunken rounded-lg p-3 border border-line"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-ink-soft">{goal.text}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeGoal(goal.id)}
                                        className="h-6 w-6 p-0 hover:bg-red-100"
                                      >
                                        <X className="w-3 h-3 text-red-500" />
                                      </Button>
                                    </div>
                                  </SortableItem>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </SortableContext>
                      </DndContext>

                      {/* Add new goal */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a new study goal..."
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                          className="flex-1 px-3 py-2 border border-line-strong rounded-lg text-sm focus:outline-none focus:border-pulse bg-surface text-ink transition-all duration-200 hover:border-ink-faint shadow-sm"
                        />
                        <Button onClick={addGoal} size="sm" disabled={!newGoal.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* File Upload Zone */}
                    <div className="px-4">
                      <label className="block text-sm font-medium text-ink-soft mb-3">
                        Study Materials (Shared with partners)
                      </label>
                      <FileUploadZone onFilesUploaded={(files) => console.log('Files:', files)} />
                    </div>

                    {/* Camera and Mic Controls */}
                    <div className="px-4">
                      <label className="block text-sm font-medium text-ink-soft mb-3">Media Settings</label>
                      <div className="flex gap-3">
                        <Button
                            onClick={handleCameraToggle}
                            variant={cameraOn ? "default" : "outline"}
                            className="w-full transition-all duration-200"
                          >
                            {cameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                            {cameraOn ? "Camera On" : "Camera Off"}
                          </Button>
                        <Button 
                            onClick={handleMicToggle}
                            variant={micOn ? "default" : "outline"} 
                            className="w-full transition-all duration-200"
                          >
                            {micOn ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                            {micOn ? "Mic On" : "Mic Off"}
                          </Button>
                      </div>
                    </div>

                    {/* Start Pairing Button */}
                    <div className="flex justify-center px-4 py-3">
                      <Button
                          onClick={handleStartPairing}
                          disabled={!isFormValid}
                          loading={isStartingSession}
                          className="h-12 min-w-[200px] relative bg-ink text-white rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" style={{ fontWeight: 600 }}
                        >
                          {!isStartingSession && <Search className="w-4 h-4 mr-2" />}
                          {isStartingSession ? "Preparing..." : "Start Collaborative Session"}
                        </Button>
                    </div>

                    {/* Form validation feedback */}
                    {!isFormValid && (
                      <div className="px-4">
                        <p className="text-sm text-ink-mute text-center">
                          Please fill in all fields and add at least one study goal to start pairing
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Searching Phase - Perfectly Centered Full Screen */}
              {phase === 'searching' && (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 flex items-center justify-center bg-surface z-10"
                  style={{ marginTop: '64px' }}
                >
                  <div className="flex flex-col items-center justify-center max-w-md w-full px-6">
                    {/* Animated Pulse Circle */}
                    <motion.div
                      className="w-24 h-24 mb-8 relative"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="absolute inset-0 bg-pulse rounded-full opacity-20 animate-ping" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                      </div>
                    </motion.div>

                    <motion.h3 
                      className="text-2xl font-bold text-ink mb-3 text-center"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Finding your study partner
                    </motion.h3>
                    <p className="text-ink-soft text-center mb-8">
                      Matching you with someone studying {subject}...
                    </p>

                    <Button variant="outline" onClick={handleBackToSetup} className="mt-4">
                      Cancel Search
                    </Button>
                  </div>
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
                  <Card className="hover:shadow-md transition-shadow mb-6 border-line">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{partner.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-ink">Studying with {partner.name}</h3>
                            <p className="text-sm text-ink-soft">{subject} • {duration} minutes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  <h2 className="px-4 pt-5 pb-3 text-left text-3xl font-bold text-ink" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Collaborative Pomodoro Session</h2>

                  {/* Tabs for Timer/Whiteboard/Activity */}
                  <div className="flex gap-2 px-4 mb-4 border-b border-line">
                    <button
                      onClick={() => setActiveTab('timer')}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'timer'
                          ? 'text-pulse-dark border-b-2 border-blue-600'
                          : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      Timer
                    </button>
                    <button
                      onClick={() => setActiveTab('whiteboard')}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'whiteboard'
                          ? 'text-pulse-dark border-b-2 border-blue-600'
                          : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      Whiteboard
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'activity'
                          ? 'text-pulse-dark border-b-2 border-blue-600'
                          : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      Activity
                    </button>
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
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {timerMode === 'work' ? 'Focus Time' : 'Break Time'}
                        </span>
                      </div>

                      {/* Compact Timer Display */}
                      <div className="flex gap-3 justify-center mb-4">
                        <div className="text-center">
                          <div className={`rounded-lg px-4 py-3 min-w-[80px] ${
                            timerMode === 'work' ? 'bg-surface-sunken' : 'bg-green-50'
                          }`}>
                            <p className={`text-3xl font-bold ${
                              timerMode === 'work' ? 'text-ink' : 'text-green-700'
                            }`}>{minutes}</p>
                          </div>
                          <p className="text-xs text-ink-soft mt-1">Minutes</p>
                        </div>
                        <div className="flex items-center text-2xl font-bold text-ink-faint">:</div>
                        <div className="text-center">
                          <div className={`rounded-lg px-4 py-3 min-w-[80px] ${
                            timerMode === 'work' ? 'bg-surface-sunken' : 'bg-green-50'
                          }`}>
                            <p className={`text-3xl font-bold ${
                              timerMode === 'work' ? 'text-ink' : 'text-green-700'
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
                          className="relative w-full bg-ink text-white rounded-xl overflow-hidden group transition-all duration-300" style={{ fontWeight: 600 }}
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
                          className="w-full border-green-500 text-green-700 hover:bg-green-50"
                        >
                          Skip Break
                        </Button>
                      ) : (
                        <Button
                          onClick={takeBreak}
                          variant="outline"
                          className="w-full border-green-500 text-green-700 hover:bg-green-50"
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          timerMode === 'work' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-r from-green-400 to-green-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, ((
                          (timerMode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60 - secondsLeft
                        ) / (
                          (timerMode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60
                        )) * 100))}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-ink-soft">
                      {Math.max(0, Math.min(100, Math.round(((
                        (timerMode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60 - secondsLeft
                      ) / (
                        (timerMode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60
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
                              className={`w-full flex items-start gap-2 text-sm p-2 rounded-lg transition-all ${
                                isActive 
                                  ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' 
                                  : 'bg-surface border-2 border-transparent hover:bg-surface-sunken'
                              } ${
                                running ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                              }`}
                            >
                              <Badge variant="outline" className={`mt-0.5 ${
                                isActive 
                                  ? 'bg-pulse text-white border-blue-600' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {studyGoals.indexOf(goal) + 1}
                              </Badge>
                              <span className={`flex-1 text-left ${
                                isActive ? 'text-ink font-medium' : 'text-ink-soft'
                              }`}>
                                {goal.text}
                              </span>
                              {isActive && running && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1.5"></div>
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
                    <Button variant="outline" onClick={handleBackToSetup} className="text-red-600 border-red-300 hover:bg-red-50">
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
                className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
              >
                {/* Timer Bar at Top */}
                <div className="bg-black bg-opacity-50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-white font-mono text-2xl font-bold">
                      {minutes}:{seconds}
                    </div>
                    <div className="text-gray-300 text-sm">
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
                        className="bg-surface bg-opacity-20 hover:bg-opacity-30 hover:text-white text-white border-white border-opacity-30"
                      >
                        {running ? 'Pause' : 'Start'}
                      </Button>
                      <Button
                        onClick={resetTimer}
                        variant="outline"
                        size="sm"
                        className="bg-surface bg-opacity-20 hover:bg-opacity-30 hover:text-white text-white border-white border-opacity-30"
                      >
                        Reset
                      </Button>
                    </div>
                    
                    <div className="h-6 w-px bg-surface bg-opacity-30"></div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setShowChatInFullscreen(!showChatInFullscreen)}
                        variant="outline"
                        size="sm"
                        className="bg-surface bg-opacity-20 hover:bg-opacity-30 hover:text-white text-white border-white border-opacity-30"
                      >
                        {showChatInFullscreen ? 'Hide' : 'Show'} Chat
                      </Button>
                      <Button
                        onClick={() => setIsFullscreen(false)}
                        variant="outline"
                        size="sm"
                        className="bg-surface bg-opacity-20 hover:bg-opacity-30 hover:text-white text-white border-white border-opacity-30"
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
                      <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                        {mainCameraIsPartner ? (
                          cameraOn ? (
                            <div className="text-ink-faint text-lg">Partner's Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-ink-faint">
                              <VideoOff className="w-16 h-16 mb-3" />
                              <span>{partner.name}'s camera is off</span>
                            </div>
                          )
                        ) : (
                          cameraOn ? (
                            <div className="text-ink-faint text-lg">Your Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-ink-faint">
                              <VideoOff className="w-16 h-16 mb-3" />
                              <span>Your camera is off</span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
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
                      <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                        {mainCameraIsPartner ? (
                          cameraOn ? (
                            <div className="text-ink-faint text-sm">Your Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-ink-faint">
                              <VideoOff className="w-8 h-8 mb-1" />
                              <span className="text-xs">Camera off</span>
                            </div>
                          )
                        ) : (
                          cameraOn ? (
                            <div className="text-ink-faint text-sm">Partner's Camera</div>
                          ) : (
                            <div className="flex flex-col items-center text-ink-faint">
                              <VideoOff className="w-8 h-8 mb-1" />
                              <span className="text-xs">{partner.name}'s camera is off</span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-0.5 rounded text-xs">
                        {mainCameraIsPartner ? 'You' : partner.name}
                      </div>
                      <div className="absolute top-2 right-2 bg-pulse text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to swap
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls at Bottom - No extra margin */}
                <div className="bg-black bg-opacity-50 backdrop-blur-sm px-6 py-3 flex items-center justify-center gap-4">
                  <button
                    onClick={handleCameraToggle}
                    className={`rounded-full w-14 h-14 flex items-center justify-center transition-colors ${
                      cameraOn 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {cameraOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={handleMicToggle}
                    className={`rounded-full w-14 h-14 flex items-center justify-center transition-colors ${
                      micOn 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {micOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
                  </button>
                  
                  <div className="h-8 w-px bg-surface bg-opacity-30 mx-2"></div>
                  
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
                    className="rounded-full w-14 h-14 flex items-center justify-center transition-colors bg-red-600 hover:bg-red-700"
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
                        <div className="h-64 bg-surface-sunken p-4 overflow-y-auto">
                          <div className="space-y-3">
                            {messages.map((msg) => (
                              <div key={msg.id} className="text-sm">
                                <span className={`font-medium ${msg.sender === 'you' ? 'text-green-600' : 'text-pulse-dark'}`}>
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
                              className="flex-1 px-3 py-2 border border-line-strong rounded-lg text-sm focus:outline-none focus:border-pulse bg-surface hover:border-ink-faint transition-all duration-200"
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
                          <div className="aspect-video bg-surface-sunken rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                            {cameraOn ? (
                              <div className="text-ink-mute">Partner's Camera</div>
                            ) : (
                              <div className="flex flex-col items-center text-ink-mute">
                                <VideoOff className="w-8 h-8 mb-2" />
                                <span className="text-sm">{partner.name}'s camera is off</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {partner.name}
                          </div>
                        </div>

                        {/* Your Video */}
                        <div className="relative group">
                          <div className="aspect-video bg-surface-sunken rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                            {cameraOn ? (
                              <div className="text-ink-mute">Your Camera</div>
                            ) : (
                              <div className="flex flex-col items-center text-ink-mute">
                                <VideoOff className="w-8 h-8 mb-2" />
                                <span className="text-sm">Your camera is off</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
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
                      <div className="h-48 bg-surface-sunken rounded-lg p-3 mb-4 overflow-y-auto">
                        <div className="space-y-3">
                          {messages.map((msg) => (
                            <div key={msg.id} className="text-sm">
                              <span className={`font-medium ${msg.sender === 'you' ? 'text-green-600' : 'text-pulse-dark'}`}>
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
                          className="flex-1 px-3 py-2.5 border border-line-strong rounded-lg text-sm focus:outline-none focus:border-pulse bg-surface text-ink transition-all duration-200 hover:border-ink-faint shadow-sm"
                        />
                        <Button onClick={sendMessage} size="sm" className="bg-pulse hover:bg-pulse-dark text-white">Send</Button>
                      </div>
                    </CardContent>
                  </Card>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        {/* Match Approval Card */}
        <AnimatePresence>
          {showMatchCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-surface rounded-2xl shadow-2xl max-w-[380px] w-full overflow-hidden"
              >
                {/* Simple header bar */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-white text-center">
                  <h2 className="text-base font-semibold">Match Found</h2>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Partner Profile */}
                  <div className="text-center mb-3">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {partner.name[0]}
                    </div>
                    <h3 className="text-lg font-bold text-ink">{partner.name}</h3>
                    <p className="text-xs text-ink-soft">{partner.major} • {partner.year}</p>
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(partner.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-ink-soft ml-1">({partner.rating})</span>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="bg-surface-sunken rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-ink-soft">Subject</span>
                      <span className="text-sm font-bold text-ink">{subject}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-soft">Duration</span>
                      <span className="text-sm font-bold text-ink">{duration} minutes</span>
                    </div>
                  </div>

                  {/* Their Goals */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-ink-soft mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Their Goals
                    </h4>
                    <div className="space-y-2">
                      {partner.sessionGoals.map((goal, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-ink-soft">
                          <div className="w-1.5 h-1.5 bg-pulse rounded-full mt-1.5 flex-shrink-0" />
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowMatchCard(false)
                        setSearchProgress(0)
                        // Restart search immediately
                        setTimeout(() => {
                          setPhase('searching')
                        }, 100)
                      }}
                      className="flex-1 px-5 py-2.5 bg-surface-sunken hover:bg-gray-200 text-ink-soft font-semibold rounded-xl transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        setShowMatchCard(false)
                        setPhase('session')
                      }}
                      className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  )
}
