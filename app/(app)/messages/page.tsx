"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent, ChangeEvent } from "react"
import { Avatar } from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowUp, CalendarDays, Check, FileText, Inbox, Paperclip, Search, X } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "me" | "other"
  timestamp: string
  file?: { name: string; size: number; url: string }
}
interface Conversation {
  id: number
  name: string
  subject: string
  status: "online" | "offline"
  unread: boolean
}
const initialConversations: Conversation[] = [
  { id: 1, name: "Sophia Clark", subject: "Mathematics", status: "online", unread: false },
  { id: 2, name: "Ethan Bennett", subject: "Mathematics", status: "offline", unread: true },
  { id: 3, name: "Olivia Harper", subject: "Biology", status: "online", unread: false },
  { id: 4, name: "Liam Carter", subject: "History", status: "offline", unread: false },
]
const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey! Are we still doing the calc review tonight?", sender: "other", timestamp: "10:24" },
    { id: 2, text: "Yes — 8pm work for you?", sender: "me", timestamp: "10:26" },
    { id: 3, text: "Perfect. I'll bring the problem set I couldn't finish.", sender: "other", timestamp: "10:27" },
    { id: 4, text: "Want to start with integration by parts?", sender: "other", timestamp: "10:31" },
  ],
  2: [{ id: 1, text: "I'm working on the math problems now.", sender: "other", timestamp: "08:12" }],
  3: [{ id: 1, text: "Let's meet at the library tomorrow.", sender: "other", timestamp: "Yesterday" }],
  4: [{ id: 1, text: "I've got some notes for the history exam.", sender: "other", timestamp: "Mon" }],
}
const fileSize = (bytes: number) => bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(1)
  const [showChat, setShowChat] = useState(false)
  const [threads, setThreads] = useState(initialMessages)
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [attachments, setAttachments] = useState<Record<number, File | undefined>>({})
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [attachmentError, setAttachmentError] = useState("")
  const fileInput = useRef<HTMLInputElement>(null)
  const scrollArea = useRef<HTMLDivElement>(null)
  const composer = useRef<HTMLTextAreaElement>(null)
  const objectUrls = useRef<string[]>([])
  const conversation = conversations.find(item => item.id === activeId)!
  const messages = threads[activeId] ?? []
  const draft = drafts[activeId] ?? ""
  const attachment = attachments[activeId]
  const unreadCount = conversations.filter(item => item.unread).length
  const normalizedQuery = query.trim().toLowerCase()
  const visible = conversations.filter(item => {
    const last = threads[item.id]?.at(-1)
    return (filter === "all" || item.unread) && `${item.name} ${item.subject} ${last?.text ?? ""}`.toLowerCase().includes(normalizedQuery)
  })

  useEffect(() => {
    if (scrollArea.current) scrollArea.current.scrollTop = scrollArea.current.scrollHeight
  }, [activeId, messages.length, showChat])

  useEffect(() => () => { objectUrls.current.forEach(url => URL.revokeObjectURL(url)) }, [])

  const openConversation = (id: number) => {
    setActiveId(id)
    setShowChat(true)
    setAttachmentError("")
    setConversations(previous => previous.map(item => item.id === id ? { ...item, unread: false } : item))
  }

  const send = (event?: FormEvent) => {
    event?.preventDefault()
    const text = draft.trim()
    if (!text && !attachment) return
    let file: Message["file"]
    if (attachment) {
      const url = URL.createObjectURL(attachment)
      objectUrls.current.push(url)
      file = { name: attachment.name, size: attachment.size, url }
    }
    const next: Message = {
      id: Date.now(), text, sender: "me", file,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }
    setThreads(previous => ({ ...previous, [activeId]: [...(previous[activeId] ?? []), next] }))
    setConversations(previous => {
      const current = previous.find(item => item.id === activeId)!
      return [{ ...current, unread: false }, ...previous.filter(item => item.id !== activeId)]
    })
    setDrafts(previous => ({ ...previous, [activeId]: "" }))
    setAttachments(previous => ({ ...previous, [activeId]: undefined }))
    setAttachmentError("")
    composer.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      send()
    }
  }
  const attach = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError("Choose a file smaller than 10 MB.")
      return
    }
    setAttachments(previous => ({ ...previous, [activeId]: file }))
    setAttachmentError("")
  }

  return (
    <div className="min-h-screen bg-paper">
      <main className="container-page max-w-6xl py-8 sm:py-10">
        <header className="mb-6">
          <p className="eyebrow">Keep the conversation going</p>
          <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[38px]">Messages</h1>
          <p className="mt-2 text-[15px] text-ink-soft">Make plans, share notes, and pick up where you left off.</p>
        </header>
        <div className="grid h-[min(720px,calc(100dvh-250px))] min-h-[440px] overflow-hidden rounded-3xl border border-line bg-surface shadow-soft md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside aria-label="Conversations" className={`min-h-0 flex-col border-line md:flex md:border-r ${showChat ? "hidden" : "flex"}`}>
            <div className="space-y-4 border-b border-line p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-bold text-ink">Your conversations</h2>
                {unreadCount > 0 && <span className="rounded-full bg-pulse-soft px-2 py-0.5 text-[10px] font-semibold text-pulse-dark">{unreadCount} unread</span>}
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-mute" strokeWidth={1.8} />
                <Input aria-label="Search conversations" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search people or subjects" className="h-10 rounded-xl bg-surface-sunken pl-9 text-xs" />
              </div>
              <div className="flex gap-1" aria-label="Filter conversations">
                {(["all", "unread"] as const).map(value => (
                  <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse ${filter === value ? "bg-surface-sunken text-ink" : "text-ink-mute hover:text-ink"}`}>{value === "all" ? "All messages" : "Unread"}</button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
              {visible.map(item => {
                const last = threads[item.id]?.at(-1)
                return (
                  <button key={item.id} type="button" onClick={() => openConversation(item.id)} aria-current={activeId === item.id ? "true" : undefined} className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse ${activeId === item.id ? "border-pulse/15 bg-pulse-soft/60" : "border-transparent hover:bg-surface-sunken"}`}>
                    <Avatar name={item.name} size="sm" status={item.status} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold text-ink">{item.name}</span>
                        <span className="shrink-0 text-[10px] text-ink-mute">{last?.timestamp}</span>
                      </span>
                      <span className="mt-0.5 block text-[10px] text-ink-mute">{item.subject}</span>
                      <span className="mt-1 flex items-center gap-2">
                        <span className={`truncate text-xs leading-5 ${item.unread ? "font-medium text-ink" : "text-ink-soft"}`}>{last?.sender === "me" ? "You: " : ""}{last?.text || last?.file?.name || "Start a conversation"}</span>
                        {item.unread && <span className="size-1.5 shrink-0 rounded-full bg-pulse"><span className="sr-only">Unread</span></span>}
                      </span>
                    </span>
                  </button>
                )
              })}
              {visible.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <Inbox className="mx-auto size-5 text-ink-mute" strokeWidth={1.6} />
                  <p className="mt-3 text-sm font-medium text-ink">{query ? "No conversations found" : "You're all caught up"}</p>
                  <p className="mt-2 text-xs leading-5 text-ink-soft">{query ? "Try another name, subject, or message." : "There are no unread messages."}</p>
                  <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setQuery(""); setFilter("all") }}>Show all messages</Button>
                </div>
              )}
            </div>
          </aside>

          <section aria-label={`Conversation with ${conversation.name}`} className={`min-h-0 min-w-0 flex-col md:flex ${showChat ? "flex" : "hidden"}`}>
            <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-4 sm:px-5">
              <Button variant="ghost" size="icon-sm" onClick={() => setShowChat(false)} className="shrink-0 md:hidden" aria-label="Back to conversations"><ArrowLeft className="size-4" /></Button>
              <Avatar name={conversation.name} size="sm" status={conversation.status} />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-ink">{conversation.name}</h2>
                <p className="mt-0.5 truncate text-[11px] text-ink-mute">{conversation.subject} · {conversation.status === "online" ? "Online" : "Offline"}</p>
              </div>
              <Button asChild variant="secondary" size="icon-sm">
                <Link href="/schedule" aria-label={`Open schedule to plan a session with ${conversation.name}`} title="Plan a session"><CalendarDays className="size-3.5" strokeWidth={1.8} /></Link>
              </Button>
            </header>

            <div ref={scrollArea} role="log" aria-label="Message history" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-paper/50 p-4 sm:p-6">
              <div className="mb-7 flex items-center gap-4" aria-hidden="true"><span className="h-px flex-1 bg-line" /><span className="text-[10px] font-medium text-ink-mute">Conversation history</span><span className="h-px flex-1 bg-line" /></div>
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const mine = message.sender === "me"
                  const grouped = index > 0 && messages[index - 1].sender === message.sender
                  return (
                    <div key={message.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                      {!mine && <span className="w-7 shrink-0">{!grouped && <Avatar name={conversation.name} size="xs" />}</span>}
                      <div className="min-w-0 max-w-[85%] sm:max-w-[75%]">
                        <div className={`rounded-2xl px-4 py-3 ${mine ? "rounded-br-md bg-pulse-soft text-ink" : "rounded-bl-md border border-line bg-surface text-ink"}`}>
                          <span className="sr-only">{mine ? "You" : conversation.name}: </span>
                          {message.file && <a href={message.file.url} download={message.file.name} className="mb-1 flex items-center gap-2 rounded-xl border border-line bg-surface/80 p-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse"><FileText className="size-4 shrink-0 text-pulse-dark" strokeWidth={1.8} /><span className="min-w-0"><span className="block break-all text-xs font-medium underline underline-offset-2">{message.file.name}</span><span className="text-[10px] text-ink-mute">{fileSize(message.file.size)} · Local file</span></span></a>}
                          {message.text && <p className="whitespace-pre-wrap break-words text-sm leading-6 [overflow-wrap:anywhere]">{message.text}</p>}
                        </div>
                        <p className={`mt-1.5 flex items-center gap-1 text-[10px] text-ink-mute ${mine ? "justify-end" : ""}`}><span>{message.timestamp}</span>{mine && <Check className="size-3" aria-label="Added locally" />}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <form onSubmit={send} className="shrink-0 border-t border-line bg-surface p-3 sm:p-4">
              {attachment && <div className="mb-3 flex items-center gap-2 rounded-xl border border-line bg-surface-sunken px-3 py-2"><FileText className="size-3.5 shrink-0 text-pulse-dark" /><span className="min-w-0 flex-1 truncate text-xs text-ink">{attachment.name} <span className="text-ink-mute">· {fileSize(attachment.size)}</span></span><Button type="button" variant="ghost" size="icon-sm" aria-label="Remove attachment" onClick={() => setAttachments(previous => ({ ...previous, [activeId]: undefined }))}><X className="size-3.5" /></Button></div>}
              {attachmentError && <p role="alert" className="mb-2 text-xs text-rose-deep">{attachmentError}</p>}
              <div className="flex items-end gap-2 rounded-2xl border border-line-strong bg-surface p-2 focus-within:border-pulse focus-within:ring-2 focus-within:ring-pulse/10">
                <input ref={fileInput} type="file" className="hidden" onChange={attach} />
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach a file, up to 10 MB" onClick={() => fileInput.current?.click()}><Paperclip className="size-4" strokeWidth={1.8} /></Button>
                <textarea ref={composer} aria-label={`Message ${conversation.name}`} value={draft} onChange={event => setDrafts(previous => ({ ...previous, [activeId]: event.target.value }))} onKeyDown={onKeyDown} placeholder="Write a message…" rows={2} maxLength={5000} className="max-h-32 min-h-9 min-w-0 flex-1 resize-y bg-transparent py-2 text-sm leading-5 text-ink outline-none placeholder:text-ink-mute" />
                <Button type="submit" variant="accent" size="icon-sm" disabled={!draft.trim() && !attachment} aria-label="Send message"><ArrowUp className="size-4" strokeWidth={1.8} /></Button>
              </div>
              <p className="mt-2 hidden px-1 text-[10px] text-ink-mute sm:block">Enter to send · Shift + Enter for a new line</p>
            </form>
          </section>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-ink-mute">Preview conversations · messages and files stay in this visit and are not sent to other users.</p>
      </main>
    </div>
  )
}
