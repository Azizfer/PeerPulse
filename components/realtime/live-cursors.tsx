"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MousePointer2 } from 'lucide-react'

interface Cursor {
  id: string
  x: number
  y: number
  name: string
  color: string
  lastSeen: number
}

interface LiveCursorsProps {
  roomId: string
  userName: string
}

export function LiveCursors({ roomId, userName }: LiveCursorsProps) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({})
  const [myPosition, setMyPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate other users' cursors
  useEffect(() => {
    const simulateOtherUsers = () => {
      const otherUsers = [
        { id: 'user1', name: 'Alex', color: '#3B82F6' },
        { id: 'user2', name: 'Sarah', color: '#10B981' },
        { id: 'user3', name: 'Mike', color: '#F59E0B' }
      ]

      const interval = setInterval(() => {
        setCursors(prev => {
          const newCursors = { ...prev }
          
          otherUsers.forEach(user => {
            if (Math.random() > 0.3) { // 70% chance to show cursor
              newCursors[user.id] = {
                id: user.id,
                name: user.name,
                color: user.color,
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
                lastSeen: Date.now()
              }
            }
          })

          // Remove old cursors
          Object.keys(newCursors).forEach(id => {
            if (Date.now() - newCursors[id].lastSeen > 5000) {
              delete newCursors[id]
            }
          })

          return newCursors
        })
      }, 2000)

      return () => clearInterval(interval)
    }

    const cleanup = simulateOtherUsers()
    return cleanup
  }, [roomId])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMyPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {Object.values(cursors).map((cursor) => (
          <motion.div
            key={cursor.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute pointer-events-none"
            style={{
              left: cursor.x,
              top: cursor.y,
              color: cursor.color
            }}
          >
            <div className="relative">
              <MousePointer2 
                className="w-5 h-5 transform -rotate-12" 
                style={{ color: cursor.color }}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 left-2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
