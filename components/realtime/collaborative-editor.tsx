"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Users, Edit3, MessageCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface CollaborativeEditorProps {
  initialContent: string
  onContentChange: (content: string) => void
  placeholder?: string
  roomId: string
}

interface EditingUser {
  id: string
  name: string
  color: string
  position: number
}

export function CollaborativeEditor({ 
  initialContent, 
  onContentChange, 
  placeholder = "Start typing...",
  roomId 
}: CollaborativeEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [editingUsers, setEditingUsers] = useState<EditingUser[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Emit content changes to parent once content state updates
  useEffect(() => {
    onContentChange(content)
  }, [content, onContentChange])

  // Simulate collaborative editing
  useEffect(() => {
    const simulateCollaboration = () => {
      const users = [
        { id: 'user1', name: 'Alex', color: '#3B82F6' },
        { id: 'user2', name: 'Sarah', color: '#10B981' }
      ]

      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of collaborative edit
          const user = users[Math.floor(Math.random() * users.length)]
          const additions = [
            " (great point!)",
            " - need to review this",
            " ✓",
            " [important]"
          ]
          
          const addition = additions[Math.floor(Math.random() * additions.length)]
          
          setContent(prev => prev + addition)

          // Show typing indicator
          setEditingUsers([{
            id: user.id,
            name: user.name,
            color: user.color,
            position: content.length
          }])

          toast({
            title: `${user.name} is editing`,
            description: "Real-time collaboration active",
            variant: "success"
          })

          setTimeout(() => {
            setEditingUsers([])
          }, 2000)
        }
      }, 8000)

      return () => clearInterval(interval)
    }

    const cleanup = simulateCollaboration()
    return cleanup
  }, [content, onContentChange, toast])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    
    // Show typing indicator
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  return (
    <div className="relative">
      {/* Collaborative indicators */}
      <div className="flex items-center gap-2 mb-2">
        {editingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs text-ink-soft bg-surface-sunken px-2 py-1 rounded-full"
          >
            <Edit3 className="w-3 h-3" />
            <span>{editingUsers[0].name} is editing...</span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: editingUsers[0].color }}
            />
          </motion.div>
        )}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs text-pulse-dark bg-blue-50 px-2 py-1 rounded-full"
          >
            <MessageCircle className="w-3 h-3" />
            <span>You are typing...</span>
          </motion.div>
        )}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full min-h-[100px] resize-none rounded-xl border border-line-strong bg-surface px-4 py-3 text-base font-normal text-ink placeholder:text-ink-mute focus:outline-none focus:border-pulse transition-all duration-200 hover:border-ink-faint"
        />
        
        {/* Live editing cursors within text */}
        {editingUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-0.5 h-5 animate-pulse"
            style={{
              backgroundColor: user.color,
              left: `${Math.min(user.position * 8 + 16, 90)}%`,
              top: '20px'
            }}
          />
        ))}
      </div>

      {/* Character count and collaboration status */}
      <div className="flex justify-between items-center mt-2 text-xs text-ink-mute">
        <span>{content.length} characters</span>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>{editingUsers.length + 1} active</span>
        </div>
      </div>
    </div>
  )
}
