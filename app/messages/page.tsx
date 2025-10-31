"use client"

import { useState } from 'react'
import Image from 'next/image'
import Header from "@/components/Header"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Search, Send, Paperclip } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'me' | 'other'
  timestamp: string
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: boolean
}

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<number>(1)
  const [messageInput, setMessageInput] = useState('')

  const conversations: Conversation[] = [
    {
      id: 1,
      name: 'Sophia Clark',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_WjD-X3mqUSyMqemCcFzCgxYarKeyWb_V8-3QqaPfwKqaNpKmulTBcW1anpkFEtDODB3nUDfMXjCcXPj32Ze8vgssv3_ASBXyLdemzQkyrPygBx-5pASwYWiYvvqgPzJwfS8_vTILIsYu3J7LuVNZ72K9LluCyWdCVjPMANDmUDPfpy27Gifsf15nkvmzYICgrrM29Cp25_6Fz8Gh3HvmEEs15YIJtvF49wcDtZJJQGdq0ZZHKxh1AquawcD8ei44d8yGNk2vTc',
      lastMessage: 'Hey, are you free to study tonight?',
      timestamp: '2h',
      unread: true
    },
    {
      id: 2,
      name: 'Ethan Bennett',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFYJrfMwHR6W7cqhsfKYPQ-8M9mCTxsMQ_ZGby1cO9B3qU_JjyQbUtFgcupumkOLAVCQGi09bASQIbD08GVLc0FcoBKWx7VvTKmCIfxUnfofagE63xn13qLuY_7gYyVCk2LQjIBRX94iIt7uBY1fCwAyVqYf4monL_qSMwNQo1_SZ9Jsv9d4aaGp_jWQp9XFrxGQjY7GNBpTOhcizXwLLmeHBc_wFyoNnigtnTmt6gPBmhBwRL34oFFoXRMHtfbDdzbJWMXhg6i8g',
      lastMessage: "I'm working on the math problems now.",
      timestamp: '4h'
    },
    {
      id: 3,
      name: 'Olivia Harper',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0vqMSARbIehCAlZjQEGDq-27p0JQ4-d6_kQHcYchCKF3JLwv9JmWKM2zr0rsr_yZnibUhcYwejMY7WEvkIGKNt7WLdDVuAEnVu12ZtUnlebMyH_DOtJJOfih7uKnF0vcnXcVd98xtnzH3w0ayPv7QvkT5gXwgcaN3XBzJXbnssWAeLQdRTH9h7YFakldyjX2u8hZFXv8s2odACApKm5GgD0SedtAqAEY2ngFmtVwDDVWTF8ZwPiqRYZD-MorSc5Y7nIC70K3i69Q',
      lastMessage: "Let's meet at the library tomorrow.",
      timestamp: '1d'
    },
    {
      id: 4,
      name: 'Liam Carter',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeMjXj7DxwMrc2PMARpqXByMlF02IoIbV8gGMS9ixevhPyzd3OgmMUy8JaGqfaEJ_GwIH5xtNaKmPkoGalaD_7OPqC67ofPjvGB5D-mgJ_iI-P-siqAkUXmY3dCAZcOQ385I4Em_7o76Swt1BnYsCOvzlTJ-7nzpxFe0rfm6O-lmu31I5KzmKuqbbVS1zIjf8NPGvp0it-2qqzisfx_mT8C126Bt92jk2c4Lwfz5f4UfcSWcckEYraN4f5HNR4rWUIKcca-btG_NI',
      lastMessage: "I've got some notes for the history exam.",
      timestamp: '2d'
    }
  ]

  const messages: Record<number, Message[]> = {
    1: [
      {
        id: 1,
        text: 'Hey, are you free to study tonight?',
        sender: 'other',
        timestamp: '2h ago'
      },
      {
        id: 2,
        text: "Yeah, I'm free. What subject?",
        sender: 'me',
        timestamp: '2h ago'
      },
      {
        id: 3,
        text: "Math, specifically calculus. I'm stuck on a few problems.",
        sender: 'other',
        timestamp: '1h ago'
      },
      {
        id: 4,
        text: 'Sure, I can help with that. Do you have the problems with you?',
        sender: 'me',
        timestamp: '1h ago'
      },
      {
        id: 5,
        text: "Yes, I'll send them over. Thanks!",
        sender: 'other',
        timestamp: '30m ago'
      }
    ],
    2: [
      {
        id: 1,
        text: "I'm working on the math problems now.",
        sender: 'other',
        timestamp: '4h ago'
      },
      {
        id: 2,
        text: 'Great! Let me know if you need help.',
        sender: 'me',
        timestamp: '4h ago'
      }
    ],
    3: [
      {
        id: 1,
        text: "Let's meet at the library tomorrow.",
        sender: 'other',
        timestamp: '1d ago'
      },
      {
        id: 2,
        text: 'Sounds good! What time works for you?',
        sender: 'me',
        timestamp: '1d ago'
      }
    ],
    4: [
      {
        id: 1,
        text: "I've got some notes for the history exam.",
        sender: 'other',
        timestamp: '2d ago'
      },
      {
        id: 2,
        text: 'That would be really helpful, thanks!',
        sender: 'me',
        timestamp: '2d ago'
      }
    ]
  }

  const currentConversation = conversations.find(c => c.id === activeConversation)
  const currentMessages = messages[activeConversation] || []

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f5f1e8] font-[Lexend,_'Noto_Sans',_sans-serif]">
        <Header />
        
        <main className="flex flex-1 h-[calc(100vh-80px)]">
          {/* Left Sidebar - Conversations List */}
          <aside className="w-80 bg-[#fdfcfa] flex flex-col border-r-2 border-gray-300">
            {/* Sidebar Header */}
            <div className="p-4 border-b-2 border-gray-300">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:border-transparent bg-[#fdfcfa] hover:border-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200 ${
                    activeConversation === conversation.id ? 'bg-blue-50' : 'bg-[#fdfcfa]'
                  }`}
                >
                  <Image
                    src={conversation.avatar || "/placeholder.svg"}
                    width={48}
                    height={48}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium truncate ${
                        conversation.unread ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${
                      conversation.unread ? 'text-gray-600 font-medium' : 'text-gray-500'
                    }`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Right Main Area - Active Conversation */}
          <section className="flex-1 flex flex-col bg-[#fdfcfa]">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-[#fdfcfa] border-b-2 border-gray-300">
                  <div className="flex items-center gap-3">
                    <Image
                      src={currentConversation.avatar || "/placeholder.svg"}
                      width={40}
                      height={40}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">{currentConversation.name}</h2>
                      <p className="text-sm text-gray-500">Active now</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f5f1e8]">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                        {message.sender === 'other' && (
                          <Image
                            src={currentConversation.avatar || "/placeholder.svg"}
                            width={32}
                            height={32}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.sender === 'me'
                              ? 'bg-blue-500 text-white rounded-br-sm'
                              : 'bg-[#fdfcfa] text-gray-900 rounded-bl-sm border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        {message.sender === 'me' && (
                          <Image
                            src="/diverse-user-avatars.png"
                            width={32}
                            height={32}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gradient-to-br from-orange-400 to-pink-400"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-[#fdfcfa] border-t-2 border-gray-300">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/diverse-user-avatars.png"
                      width={40}
                      height={40}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gradient-to-br from-orange-400 to-pink-400 self-center"
                    />
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Write a message..."
                        className="w-full px-4 py-2.5 pr-16 rounded-2xl text-sm bg-[#fdfcfa] border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:border-transparent resize-none max-h-32 hover:border-gray-400 transition-all duration-200"
                        rows={1}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          size="sm"
                          className="flex items-center justify-center h-8 w-8 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#f5f1e8]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging.</p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </PageTransition>
  )
}
