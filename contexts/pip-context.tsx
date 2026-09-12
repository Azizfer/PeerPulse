"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, VideoOff, Mic, MicOff, X, Maximize2 } from 'lucide-react'

interface PiPContextType {
  isPiPActive: boolean
  activatePiP: (data: PiPData) => void
  deactivatePiP: () => void
  updatePiPData: (data: Partial<PiPData>) => void
  goFullscreen: () => void
}

interface PiPData {
  partnerName: string
  timerMinutes: string
  timerSeconds: string
  activeGoal?: string
  userCameraOn: boolean
  userMicOn: boolean
  partnerCameraOn: boolean
  partnerMicOn: boolean
  onUserCameraToggle: () => void
  onUserMicToggle: () => void
  onFullscreen: () => void
  onEndSession: () => void
}

const PiPContext = createContext<PiPContextType | undefined>(undefined)

export function usePiP() {
  const context = useContext(PiPContext)
  if (!context) {
    throw new Error('usePiP must be used within PiPProvider')
  }
  return context
}

export function PiPProvider({ children }: { children: ReactNode }) {
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [pipData, setPipData] = useState<PiPData | null>(null)

  const activatePiP = useCallback((data: PiPData) => {
    setPipData(data)
    setIsPiPActive(true)
  }, [])

  const deactivatePiP = useCallback(() => {
    setIsPiPActive(false)
  }, [])

  const updatePiPData = useCallback((data: Partial<PiPData>) => {
    setPipData(prev => {
      if (!prev) return prev
      return { ...prev, ...data }
    })
  }, [])

  const goFullscreen = useCallback(() => {
    setIsPiPActive(false)
    setPipData(prev => {
      if (prev?.onFullscreen) {
        // Small delay to allow PiP to close before navigating
        setTimeout(() => {
          prev.onFullscreen()
        }, 100)
      }
      return prev
    })
  }, [])

  return (
    <PiPContext.Provider value={{ isPiPActive, activatePiP, deactivatePiP, updatePiPData, goFullscreen }}>
      {children}
      
      {/* Global PiP Window */}
      <AnimatePresence>
        {isPiPActive && pipData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-[9999] w-80 bg-surface rounded-xl shadow-2xl border border-line-strong"
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{
              top: -window.innerHeight + 300,
              left: -window.innerWidth + 320,
              right: 0,
              bottom: 0,
            }}
          >
            <div className="relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-t-xl flex items-center justify-between cursor-move">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Study with {pipData.partnerName}</span>
                </div>
                <button
                  onClick={deactivatePiP}
                  className="hover:bg-surface hover:bg-opacity-20 rounded p-1 transition-colors text-white"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Video */}
              <div className="p-3">
                <div className="relative group">
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    {pipData.partnerCameraOn ? (
                      <div className="text-ink-faint text-xs">Partner's Camera</div>
                    ) : (
                      <div className="flex flex-col items-center text-ink-faint">
                        <VideoOff className="w-6 h-6 mb-1" />
                        <span className="text-xs">{pipData.partnerName}'s camera is off</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-0.5 rounded text-xs">
                    {pipData.partnerName}
                  </div>
                  {/* Your Camera PiP */}
                  {pipData.userCameraOn && (
                    <div className="absolute top-2 right-2 w-16 aspect-video bg-gray-700 rounded border-2 border-white shadow-lg flex items-center justify-center">
                      <div className="text-white text-[8px]">You</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mini Controls */}
              <div className="px-3 pb-3">
                <div className="text-[10px] text-ink-mute text-center mb-2">Your Controls</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <button
                    onClick={pipData.onUserCameraToggle}
                    className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
                      pipData.userCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                    }`}
                    title="Toggle your camera"
                  >
                    {pipData.userCameraOn ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    onClick={pipData.onUserMicToggle}
                    className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
                      pipData.userMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                    }`}
                    title="Toggle your mic"
                  >
                    {pipData.userMicOn ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    onClick={goFullscreen}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-pulse hover:bg-pulse-dark transition-colors"
                    title="Go to fullscreen"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={pipData.onEndSession}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 transition-colors"
                    title="End session"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Timer Display */}
              <div className="px-3 pb-3 border-t border-line pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-soft">Timer:</span>
                  <span className="font-mono font-bold text-ink">{pipData.timerMinutes}:{pipData.timerSeconds}</span>
                </div>
                {pipData.activeGoal && (
                  <div className="mt-1 text-xs text-ink-soft truncate">
                    📌 {pipData.activeGoal}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PiPContext.Provider>
  )
}
