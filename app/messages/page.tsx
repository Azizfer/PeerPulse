"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Avatar } from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { Paperclip, Search, Send } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "me" | "other"
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

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sophia Clark",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_WjD-X3mqUSyMqemCcFzCgxYarKeyWb_V8-3QqaPfwKqaNpKmulTBcW1anpkFEtDODB3nUDfMXjCcXPj32Ze8vgssv3_ASBXyLdemzQkyrPygBx-5pASwYWiYvvqgPzJwfS8_vTILIsYu3J7LuVNZ72K9LluCyWdCVjPMANDmUDPfpy27Gifsf15nkvmzYICgrrM29Cp25_6Fz8Gh3HvmEEs15YIJtvF49wcDtZJJQGdq0ZZHKxh1AquawcD8ei44d8yGNk2vTc",
    lastMessage: "Hey, are you free to study tonight?",
    timestamp: "2h",
    unread: true,
  },
  {
    id: 2,
    name: "Ethan Bennett",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFYJrfMwHR6W7cqhsfKYPQ-8M9mCTxsMQ_ZGby1cO9B3qU_JjyQbUtFgcupumkOLAVCQGi09bASQIbD08GVLc0FcoBKWx7VvTKmCIfxUnfofagE63xn13qLuY_7gYyVCk2LQjIBRX94iIt7uBY1fCwAyVqYf4monL_qSMwNQo1_SZ9Jsv9d4aaGp_jWQp9XFrxGQjY7GNBpTOhcizXwLLmeHBc_wFyoNnigtnTmt6gPBmhBwRL34oFFoXRMHtfbDdzbJWMXhg6i8g",
    lastMessage: "I'm working on the math problems now.",
    timestamp: "4h",
  },
  {
    id: 3,
    name: "Olivia Harper",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0vqMSARbIehCAlZjQEGDq-27p0JQ4-d6_kQHcYchCKF3JLwv9JmWKM2zr0rsr_yZnibUhcYwejMY7WEvkIGKNt7WLdDVuAEnVu12ZtUnlebMyH_DOtJJOfih7uKnF0vcnXcVd98xtnzH3w0ayPv7QvkT5gXwgcaN3XBzJXbnssWAeLQdRTH9h7YFakldyjX2u8hZFXv8s2odACApKm5GgD0SedtAqAEY2ngFmtVwDDVWTF8ZwPiqRYZD-MorSc5Y7nIC70K3i69Q",
    lastMessage: "Let's meet at the library tomorrow.",
    timestamp: "1d",
  },
  {
    id: 4,
    name: "Liam Carter",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeMjXj7DxwMrc2PMARpqXByMlF02IoIbV8gGMS9ixevhPyzd3OgmMUy8JaGqfaEJ_GwIH5xtNaKmPkoGalaD_7OPqC67ofPjvGB5D-mgJ_iI-P-siqAkUXmY3dCAZcOQ385I4Em_7o76Swt1BnYsCOvzlTJ-7nzpxFe0rfm6O-lmu31I5KzmKuqbbVS1zIjf8NPGvp0it-2qqzisfx_mT8C126Bt92jk2c4Lwfz5f4UfcSWcckEYraN4f5HNR4rWUIKcca-btG_NI",
    lastMessage: "I've got some notes for the history exam.",
    timestamp: "2d",
  },
]

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey! Are we still doing the calc review tonight?", sender: "other", timestamp: "10:24" },
    { id: 2, text: "Yes — 8pm work for you?", sender: "me", timestamp: "10:26" },
    { id: 3, text: "Perfect. I'll bring the problem set I couldn't finish.", sender: "other", timestamp: "10:27" },
    { id: 4, text: "Hey, are you free to study tonight?", sender: "other", timestamp: "10:31" },
  ],
  2: [
    { id: 1, text: "I'm working on the math problems now.", sender: "other", timestamp: "08:12" },
    { id: 2, text: "Same. Question 4 is destroying me.", sender: "me", timestamp: "08:14" },
  ],
  3: [
    { id: 1, text: "Let's meet at the library tomorrow.", sender: "other", timestamp: "Yesterday" },
  ],
  4: [
    { id: 1, text: "I've got some notes for the history exam.", sender: "other", timestamp: "2 days ago" },
  ],
}

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<number>(1)
  const [messageInput, setMessageInput] = useState("")
  const [threads, setThreads] = useState<Record<number, Message[]>>(initialMessages)
  const [query, setQuery] = useState("")

  const currentConversation = conversations.find((c) => c.id === activeConversation)
  const currentMessages = threads[activeConversation] ?? []

  const visibleConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  )

  const handleSendMessage = () => {
    const text = messageInput.trim()
    if (!text) return
    setThreads((prev) => ({
      ...prev,
      [activeConversation]: [
        ...(prev[activeConversation] ?? []),
        {
          id: Date.now(),
          text,
          sender: "me" as const,
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }))
    setMessageInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container-page py-8 sm:py-10">
        <div className="grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-soft lg:grid-cols-[320px_1fr]">
          {/* ---------------- Sidebar ---------------- */}
          <aside className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
            <div className="border-b border-line p-5">
              <h1 className="font-display text-[26px] font-extrabold tracking-[-0.035em] text-ink">
                Messages
              </h1>
              <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Search conversations"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-11 w-full rounded-full border border-line-strong bg-surface pl-11 pr-4 text-[14px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                />
              </div>
            </div>

            <div className="max-h-[420px] flex-1 overflow-y-auto lg:max-h-none">
              {visibleConversations.map((conversation) => {
                const active = activeConversation === conversation.id
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveConversation(conversation.id)}
                    className={`flex w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left transition-colors last:border-b-0 ${
                      active ? "bg-surface-sunken" : "hover:bg-surface-sunken"
                    }`}
                  >
                    <Avatar name={conversation.name} src={conversation.avatar} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`truncate font-display text-[14.5px] ${
                            conversation.unread ? "font-bold text-ink" : "font-semibold text-ink"
                          }`}
                        >
                          {conversation.name}
                        </span>
                        <span className="shrink-0 text-[12px] text-ink-mute">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p
                        className={`truncate text-[13px] ${
                          conversation.unread ? "font-medium text-ink-soft" : "text-ink-mute"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-pulse" />
                    )}
                  </button>
                )
              })}
            </div>
          </aside>

          {/* ---------------- Conversation ---------------- */}
          <section className="flex min-h-[520px] flex-col">
            {currentConversation ? (
              <>
                <header className="flex items-center gap-3 border-b border-line px-6 py-4">
                  <Avatar
                    name={currentConversation.name}
                    src={currentConversation.avatar}
                    size="sm"
                    status="online"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] font-bold text-ink">
                      {currentConversation.name}
                    </p>
                    <p className="text-[12.5px] text-ink-mute">Active now</p>
                  </div>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto bg-paper px-6 py-6">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        message.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "other" && (
                        <Avatar
                          name={currentConversation.name}
                          src={currentConversation.avatar}
                          size="xs"
                        />
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          message.sender === "me"
                            ? "rounded-br-md bg-ink text-white"
                            : "rounded-bl-md border border-line bg-surface text-ink"
                        }`}
                      >
                        <p className="text-[14.5px] leading-relaxed">{message.text}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            message.sender === "me" ? "text-white/50" : "text-ink-faint"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" aria-label="Attach a file">
                      <Paperclip className="h-4 w-4 text-ink-faint" />
                    </Button>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Write a message…"
                      rows={1}
                      className="max-h-32 flex-1 resize-none rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[14.5px] text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      size="icon"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center bg-paper px-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-sunken text-ink-faint">
                  <Search className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  Select a conversation
                </h3>
                <p className="mt-1.5 text-[14.5px] text-ink-soft">
                  Pick someone from the list to pick up where you left off.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
