"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Avatar } from "@/components/avatar"
import { HeaderDropdown } from "@/components/header-dropdown"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
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


  const [activeChatIds, setActiveChatIds] = useState<number[]>([])
  const unreadCount = messages.filter(message => message.unread).length
  const openChat = (id: number) => {
    setMessages(previous => previous.map(message => message.id === id ? { ...message, unread: false } : message))
    setActiveChatIds([id])
  }
  return (
    <>
      <HeaderDropdown title="Messages" icon={MessageCircle} unreadCount={unreadCount} footer={
        <DropdownMenuItem asChild className="cursor-pointer justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-ink focus:bg-surface-sunken focus:text-ink">
          <Link href="/messages">Open messages <ArrowRight className="size-3.5" /></Link>
        </DropdownMenuItem>
      }>
        {messages.map(message => (
          <DropdownMenuItem key={message.id} onSelect={() => openChat(message.id)}
            className={`mb-1 cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-ink focus:bg-surface-sunken focus:text-ink ${message.unread ? "bg-pulse-soft/40" : ""}`}>
            <Avatar name={message.name} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3"><span className="truncate text-xs font-semibold">{message.name}</span><span className="shrink-0 text-[10px] font-normal text-ink-mute">{message.timeAgo}</span></span>
              <span className="mt-1 block text-xs leading-5 text-ink-soft">{message.message}</span>
            </span>
            {message.unread && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pulse"><span className="sr-only">Unread</span></span>}
          </DropdownMenuItem>
        ))}
        {messages.length === 0 && <p className="px-4 py-8 text-center text-xs text-ink-mute">No messages yet.</p>}
      </HeaderDropdown>
      {messages.filter(chat => activeChatIds.includes(chat.id)).map((chat, index) => (
        <ChatWindow key={chat.id} isOpen onClose={() => setActiveChatIds(previous => previous.filter(id => id !== chat.id))} partnerId={chat.id} partnerName={chat.name} partnerAvatar={chat.avatar} position={index} />
      ))}
    </>
  )
}
