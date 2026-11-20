"use client"

import { motion, useReducedMotion } from "framer-motion"
import { MessageScrollerItem } from "@/components/ui/message-scroller"

export type ChatMessage = { id: string; text: string; own: boolean; sentAt: number }

export function MessageAnimated({ message, timeSeparator }: { message: ChatMessage; timeSeparator?: string }) {
  const reducedMotion = useReducedMotion()
  return (
    <MessageScrollerItem messageId={message.id}>
      {timeSeparator && <p className="my-3 text-center text-[10px] text-ink-mute"><time dateTime={new Date(message.sentAt).toISOString()}>{timeSeparator}</time></p>}
      <motion.div initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className={`flex ${message.own ? "justify-end" : "justify-start"}`}>
        <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[13px] leading-5 [overflow-wrap:anywhere] ${message.own ? "rounded-br-md bg-pulse-soft text-ink" : "rounded-bl-md bg-surface-sunken text-ink"}`}>{message.text}</p>
      </motion.div>
    </MessageScrollerItem>
  )
}
