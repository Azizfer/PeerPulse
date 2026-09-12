"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import ChatWindow from "./ChatWindow"

interface Message {
  id: number
  avatar: string
  name: string
  message: string
  timeAgo: string
  unread?: boolean
}

export default function MessagesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_WjD-X3mqUSyMqemCcFzCgxYarKeyWb_V8-3QqaPfwKqaNpKmulTBcW1anpkFEtDODB3nUDfMXjCcXPj32Ze8vgssv3_ASBXyLdemzQkyrPygBx-5pASwYWiYvvqgPzJwfS8_vTILIsYu3J7LuVNZ72K9LluCyWdCVjPMANDmUDPfpy27Gifsf15nkvmzYICgrrM29Cp25_6Fz8Gh3HvmEEs15YIJtvF49wcDtZJJQGdq0ZZHKxh1AquawcD8ei44d8yGNk2vTc',
      name: 'Sophia',
      message: 'Hey, are you free to study tonight?',
      timeAgo: '2h',
      unread: true,
    },
    {
      id: 2,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFYJrfMwHR6W7cqhsfKYPQ-8M9mCTxsMQ_ZGby1cO9B3qU_JjyQbUtFgcupumkOLAVCQGi09bASQIbD08GVLc0FcoBKWx7VvTKmCIfxUnfofagE63xn13qLuY_7gYyVCk2LQjIBRX94iIt7uBY1fCwAyVqYf4monL_qSMwNQo1_SZ9Jsv9d4aaGp_jWQp9XFrxGQjY7GNBpTOhcizXwLLmeHBc_wFyoNnigtnTmt6gPBmhBwRL34oFFoXRMHtfbDdzbJWMXhg6i8g',
      name: 'Ethan',
      message: "I'm working on the math problems now.",
      timeAgo: '4h',
      unread: true,
    },
    {
      id: 3,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0vqMSARbIehCAlZjQEGDq-27p0JQ4-d6_kQHcYchCKF3JLwv9JmWKM2zr0rsr_yZnibUhcYwejMY7WEvkIGKNt7WLdDVuAEnVu12ZtUnlebMyH_DOtJJOfih7uKnF0vcnXcVd98xtnzH3w0ayPv7QvkT5gXwgcaN3XBzJXbnssWAeLQdRTH9h7YFakldyjX2u8hZFXv8s2odACApKm5GgD0SedtAqAEY2ngFmtVwDDVWTF8ZwPiqRYZD-MorSc5Y7nIC70K3i69Q',
      name: 'Olivia',
      message: "Let's meet at the library tomorrow.",
      timeAgo: '1d',
      unread: false,
    },
    {
      id: 4,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeMjXj7DxwMrc2PMARpqXByMlF02IoIbV8gGMS9ixevhPyzd3OgmMUy8JaGqfaEJ_GwIH5xtNaKmPkoGalaD_7OPqC67ofPjvGB5D-mgJ_iI-P-siqAkUXmY3dCAZcOQ385I4Em_7o76Swt1BnYsCOvzlTJ-7nzpxFe0rfm6O-lmu31I5KzmKuqbbVS1zIjf8NPGvp0it-2qqzisfx_mT8C126Bt92jk2c4Lwfz5f4UfcSWcckEYraN4f5HNR4rWUIKcca-btG_NI',
      name: 'Liam',
      message: "I've finished the reading for the week.",
      timeAgo: '2d',
      unread: false,
    },
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = messages.filter(m => m.unread).length
  const [activeChatIds, setActiveChatIds] = useState<number[]>([])

  const activeChats = messages.filter(m => activeChatIds.includes(m.id))

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: number) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === id 
          ? { ...message, unread: false }
          : message
      )
    )
  }

  const handleViewAll = () => {
    setIsOpen(false)
    // Navigate to messages page
    window.location.href = '/messages'
  }

  const handleMessageClick = (messageId: number) => {
    markAsRead(messageId)
    if (!activeChatIds.includes(messageId)) {
      setActiveChatIds([...activeChatIds, messageId])
    }
    setIsOpen(false) // Close dropdown when opening chat
  }

  const handleCloseChat = (messageId: number) => {
    setActiveChatIds(activeChatIds.filter(id => id !== messageId))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Messages Button */}
      <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-9 w-9 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="w-4 h-4 text-ink-soft" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <div className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-deep px-1 ring-2 ring-paper">
              <span className="text-[10px] text-white font-bold leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 max-h-80 w-96 overflow-y-auto rounded-2xl border border-line bg-surface shadow-card"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-line">
              <h3 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
                Messages
              </h3>
              {unreadCount > 0 && (
                <p className="text-sm text-ink-mute mt-1">
                  {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {/* Messages List */}
            <div>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-ink-mute">
                  <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {messages.map((message, index) => (
                    <motion.li
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex min-h-[56px] items-center justify-between gap-3 px-4 py-1.5 hover:bg-surface-sunken transition-colors cursor-pointer relative group ${
                        message.unread ? 'border-l-[3px] border-l-pulse bg-pulse-soft/40' : 'border-l-[3px] border-l-transparent bg-surface'
                      }`}
                      onClick={() => handleMessageClick(message.id)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          width={48}
                          height={48}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                        />
                        
                        {/* Content */}
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                          <p className={`text-sm font-medium leading-tight ${
                            message.unread ? 'text-ink' : 'text-ink-mute'
                          }`}>
                            {message.name}
                          </p>
                          <p className="text-xs font-normal leading-snug text-ink-mute">
                            {message.message}
                          </p>
                        </div>
                      </div>

                      {/* Time and Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-normal leading-normal text-ink-mute">
                          {message.timeAgo}
                        </span>
                        
                        {/* Unread indicator */}
                        {message.unread && (
                          <div className="w-2 h-2 bg-pulse rounded-full"></div>
                        )}

                        {/* More options (hidden by default, shown on hover) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-ink-faint hover:text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle more options
                          }}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer Button */}
            {messages.length > 0 && (
              <div className="px-4 py-3 border-t border-line">
                <button 
                  onClick={handleViewAll}
                  className="flex h-9 w-full min-w-[72px] items-center justify-center overflow-hidden rounded-full bg-surface-sunken px-3 font-display text-[12.5px] font-semibold tracking-[0.01em] text-ink transition-colors hover:bg-line/50"
                >
                  View All Messages
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Windows */}
      {activeChats.map((chat, index) => (
        <ChatWindow
          key={chat.id}
          isOpen={true}
          onClose={() => handleCloseChat(chat.id)}
          partnerId={chat.id}
          partnerName={chat.name}
          partnerAvatar={chat.avatar}
          position={index}
        />
      ))}
    </div>
  )
}
