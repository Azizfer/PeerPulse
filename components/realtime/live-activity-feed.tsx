"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, User, CheckCircle, MessageCircle, Target, FileText } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface Activity {
  id: string
  type: 'join' | 'goal_complete' | 'message' | 'file_upload' | 'timer_start' | 'timer_pause'
  user: string
  message: string
  timestamp: Date
  color: string
}

interface LiveActivityFeedProps {
  roomId: string
}

export function LiveActivityFeed({ roomId }: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])

  // Simulate live activities
  useEffect(() => {
    const generateActivity = (): Activity => {
      const users = ['Alex', 'Sarah', 'Mike', 'Emma']
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
      const user = users[Math.floor(Math.random() * users.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]

      const activityTypes = [
        {
          type: 'join' as const,
          message: `${user} joined the study session`,
        },
        {
          type: 'goal_complete' as const,
          message: `${user} completed a study goal`,
        },
        {
          type: 'message' as const,
          message: `${user} sent a message`,
        },
        {
          type: 'file_upload' as const,
          message: `${user} uploaded study materials`,
        },
        {
          type: 'timer_start' as const,
          message: `${user} started the Pomodoro timer`,
        },
        {
          type: 'timer_pause' as const,
          message: `${user} paused the timer`,
        }
      ]

      const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)]

      return {
        id: Date.now().toString() + Math.random(),
        type: activity.type,
        user,
        message: activity.message,
        timestamp: new Date(),
        color
      }
    }

    // Add initial activities
    const initialActivities = Array.from({ length: 3 }, generateActivity)
    setActivities(initialActivities)

    // Simulate new activities
    const interval = setInterval(() => {
      const newActivity = generateActivity()
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]) // Keep only 10 most recent
    }, 5000)

    return () => clearInterval(interval)
  }, [roomId])

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'join':
        return <User className="w-4 h-4" />
      case 'goal_complete':
        return <CheckCircle className="w-4 h-4" />
      case 'message':
        return <MessageCircle className="w-4 h-4" />
      case 'file_upload':
        return <FileText className="w-4 h-4" />
      case 'timer_start':
      case 'timer_pause':
        return <Clock className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <h3 className="font-semibold text-ink">Live Activity</h3>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-surface-sunken rounded-lg hover:bg-surface-sunken transition-colors duration-200"
              >
                <div 
                  className="p-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
                >
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-ink-mute mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>

                {index === 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-pulse rounded-full flex-shrink-0"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8 text-ink-mute">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
