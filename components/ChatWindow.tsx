"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Message {
  id: number
  senderId: number
  text: string
  timestamp: string
  isOwn: boolean
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
  partnerId: number
  partnerName: string
  partnerAvatar: string
  position: number // For stacking multiple chats
}

export default function ChatWindow({
  isOpen,
  onClose,
  partnerId,
  partnerName,
  partnerAvatar,
  position,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: partnerId,
      text: "Hey! Are you free to study tonight?",
      timestamp: "2:30 PM",
      isOwn: false,
    },
    {
      id: 2,
      senderId: 1, // Current user
      text: "Yes! What subject?",
      timestamp: "2:32 PM",
      isOwn: true,
    },
    {
      id: 3,
      senderId: partnerId,
      text: "I was thinking we could work on the math assignment together",
      timestamp: "2:33 PM",
      isOwn: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: messages.length + 1,
      senderId: 1, // Current user
      text: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  // Calculate position based on index for stacking
  const bubbleOffset = position * 60 // 60px spacing between bubbles
  const chatOffset = position * 30 // 30px spacing between open chats

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`fixed bg-surface shadow-2xl border border-line-strong z-50 flex flex-col ${
          isMinimized ? "rounded-full overflow-visible" : "rounded-xl overflow-hidden"
        }`}
        style={{ 
          width: isMinimized ? "50px" : "320px",
          height: isMinimized ? "50px" : "450px",
          bottom: "16px",
          right: isMinimized ? `${16 + bubbleOffset}px` : `${16 + chatOffset}px`,
        }}
      >
        {/* Header / Bubble */}
        {isMinimized ? (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer relative group overflow-visible"
            onClick={() => setIsMinimized(false)}
          >
            <Image
              src={partnerAvatar || "/placeholder.svg"}
              width={50}
              height={50}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 border-b-2 border-line-strong">
            <div className="flex items-center gap-2">
              <Image
                src={partnerAvatar || "/placeholder.svg"}
                width={36}
                height={36}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-ink text-sm">{partnerName}</h3>
                <p className="text-xs text-ink-mute">Active now</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-7 w-7 p-0 text-ink-soft hover:bg-surface-sunken"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 w-7 p-0 text-ink-soft hover:bg-surface-sunken"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      message.isOwn
                        ? "bg-pulse text-white"
                        : "bg-gray-200 text-ink"
                    }`}
                  >
                    <p className="text-xs">{message.text}</p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        message.isOwn ? "text-blue-100" : "text-ink-mute"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t-2 border-line-strong">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-line-strong rounded-lg text-xs focus:outline-none focus:border-pulse bg-surface text-ink transition-all duration-200 hover:border-ink-faint"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="bg-pulse hover:bg-pulse-dark text-white px-3"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
