"use client"

import Link from "next/link"
import { createPortal } from "react-dom"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowUp, Expand, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageAnimated, type ChatMessage } from "@/components/message-animated"
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport, useMessageScroller } from "@/components/ui/message-scroller"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import { needsChatTimeSeparator } from "@/lib/chat-time"

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
  partnerId: number
  partnerName: string
  partnerAvatar: string
  position: number
}

function ChatComposer({ onSend }: { onSend: (text: string) => void }) {
  const [draft, setDraft] = useState("")
  const textarea = useRef<HTMLTextAreaElement>(null)
  const { scrollToEnd } = useMessageScroller()
  useLayoutEffect(() => {
    const control = textarea.current
    if (!control) return
    control.style.height = "0px"
    control.style.height = `${Math.min(52, Math.max(32, control.scrollHeight))}px`
  }, [draft])
  const send = () => {
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft("")
    requestAnimationFrame(() => scrollToEnd({ behavior: "auto" }))
    textarea.current?.focus()
  }
  return <form className="w-full" onSubmit={event => { event.preventDefault(); send() }}>
    <InputGroup>
      <InputGroupTextarea ref={textarea} aria-label="Quick chat message" placeholder="Write a message…" value={draft} onChange={event => setDraft(event.target.value)} rows={1} maxLength={5000} className="max-h-[52px]" onKeyDown={event => {
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send() }
      }} />
      <InputGroupAddon><InputGroupButton type="submit" variant="accent" aria-label="Send message" disabled={!draft.trim()}><ArrowUp /></InputGroupButton></InputGroupAddon>
    </InputGroup>
  </form>
}

export default function ChatWindow({ isOpen, onClose, partnerName }: ChatWindowProps) {
  const [mounted, setMounted] = useState(false)
  const [minimized, setMinimized] = useState(false)
  // The transcript is rendered in a client-only portal after mounting.
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const now = Date.now()
    return [
      { id: "preview-1", text: "Hey! Are you free to study tonight?", own: false, sentAt: now - 5 * 60 * 1000 },
      { id: "preview-2", text: "Yes! What subject?", own: true, sentAt: now - 3 * 60 * 1000 },
    ]
  })
  useEffect(() => { setMounted(true) }, [])
  if (!mounted || !isOpen) return null
  return createPortal(
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      {minimized ? (
        <div className="fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-32px)] items-center gap-1 rounded-full border border-line bg-surface p-1.5 shadow-card">
          <button type="button" aria-label={`Restore chat with ${partnerName}`} onClick={() => setMinimized(false)} className="flex min-w-0 items-center gap-2 rounded-full pr-2 text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse"><Avatar name={partnerName} size="xs" /><span className="truncate">{partnerName}</span></button>
          <Button variant="ghost" size="icon-sm" aria-label="Close chat" onClick={onClose} className="size-6 p-0"><X className="size-3" /></Button>
        </div>
      ) : (
        <Card role="region" aria-label={`Quick chat with ${partnerName}`} className="fixed bottom-24 right-4 z-50 flex h-[min(400px,calc(100dvh-128px))] w-[min(330px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl shadow-lift">
          <CardHeader className="flex-row items-center gap-2 space-y-0 border-b border-line px-3 py-2.5">
            <Avatar name={partnerName} size="xs" />
            <div className="min-w-0 flex-1"><CardTitle className="truncate text-[13px] font-semibold">{partnerName}</CardTitle><p className="mt-0.5 text-[10px] text-ink-mute">Study chat · preview</p></div>
            <div className="flex items-center gap-0.5">
              <Button asChild variant="ghost" size="icon-sm" className="size-7 rounded-lg p-0"><Link href="/messages" aria-label="Open full messages" title="Open messages"><Expand className="size-3" /></Link></Button>
              <Button variant="ghost" size="icon-sm" className="size-7 rounded-lg p-0" aria-label="Minimize chat" title="Minimize" onClick={() => setMinimized(true)}><Minus className="size-3" /></Button>
              <Button variant="ghost" size="icon-sm" className="size-7 rounded-lg p-0" aria-label="Close chat" title="Close" onClick={onClose}><X className="size-3" /></Button>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <MessageScroller>
              <MessageScrollerViewport aria-label="Chat messages">
                <MessageScrollerContent>
                  {messages.map((message, index) => <MessageAnimated key={message.id} message={message} timeSeparator={needsChatTimeSeparator(message.sentAt, messages[index - 1]?.sentAt) ? new Intl.DateTimeFormat("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(message.sentAt) : undefined} />)}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
          <CardFooter className="shrink-0 border-t border-line px-3 py-2.5">
            <ChatComposer onSend={text => setMessages(previous => [...previous, { id: crypto.randomUUID(), text, own: true, sentAt: Date.now() }])} />
          </CardFooter>
        </Card>
      )}
    </MessageScrollerProvider>, document.body,
  )
}
