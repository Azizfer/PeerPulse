"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  avatar: string
  status: 'active' | 'idle' | 'away'
  lastSeen: Date
}

interface PresenceAvatarsProps {
  roomId: string
  maxVisible?: number
}

export function PresenceAvatars({ roomId, maxVisible = 5 }: PresenceAvatarsProps) {
  const [users, setUsers] = useState<User[]>([])

  // Simulate user presence
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'Alex Rodriguez',
        avatar: '/young-man-headshot.png',
        status: 'active',
        lastSeen: new Date()
      },
      {
        id: 'user2',
        name: 'Sarah Chen',
        avatar: '/professional-headshot-woman.png',
        status: 'active',
        lastSeen: new Date()
      },
      {
        id: 'user3',
        name: 'Mike Johnson',
        avatar: '/young-man-headshot.png',
        status: 'idle',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      },
      {
        id: 'user4',
        name: 'Emma Wilson',
        avatar: '/professional-headshot-woman.png',
        status: 'away',
        lastSeen: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      }
    ]

    // Simulate users joining/leaving
    const interval = setInterval(() => {
      setUsers(prev => {
        const shouldAddUser = Math.random() > 0.7 && prev.length < 6
        const shouldRemoveUser = Math.random() > 0.8 && prev.length > 2

        if (shouldAddUser) {
          const availableUsers = mockUsers.filter(u => !prev.find(p => p.id === u.id))
          if (availableUsers.length > 0) {
            const newUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
            return [...prev, { ...newUser, status: 'active' as const, lastSeen: new Date() }]
          }
        }

        if (shouldRemoveUser) {
          return prev.slice(0, -1)
        }

        // Update status randomly
        return prev.map(user => ({
          ...user,
          status: Math.random() > 0.8 ? 
            (['active', 'idle', 'away'] as const)[Math.floor(Math.random() * 3)] : 
            user.status
        }))
      })
    }, 3000)

    // Set initial users
    setUsers(mockUsers.slice(0, 3))

    return () => clearInterval(interval)
  }, [roomId])

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'away':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const visibleUsers = users.slice(0, maxVisible)
  const hiddenCount = Math.max(0, users.length - maxVisible)

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        <AnimatePresence initial={false}>
          {visibleUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="relative group"
            >
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm cursor-pointer"
                />
                
                {/* Status indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                />

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-300 capitalize">{user.status}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show count of hidden users */}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            +{hiddenCount}
          </motion.div>
        )}
      </div>

      {/* Active users count */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Badge variant="secondary" className="text-xs">
          {users.filter(u => u.status === 'active').length} active
        </Badge>
      </motion.div>
    </div>
  )
}
