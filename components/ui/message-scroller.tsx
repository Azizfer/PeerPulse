"use client"

import * as React from "react"
import { MessageScroller as Primitive } from "@shadcn/react/message-scroller"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export const MessageScrollerProvider = Primitive.Provider
export const MessageScrollerItem = Primitive.Item
export { useMessageScroller } from "@shadcn/react/message-scroller"

export function MessageScroller({ className, ...props }: React.ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden", className)} {...props} />
}
export function MessageScrollerViewport({ className, ...props }: React.ComponentProps<typeof Primitive.Viewport>) {
  return <Primitive.Viewport className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain data-[pending-scroll]:invisible", className)} {...props} />
}
export function MessageScrollerContent({ className, ...props }: React.ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content className={cn("flex flex-col gap-2.5 p-3", className)} {...props} />
}
export function MessageScrollerButton({ className, ...props }: React.ComponentProps<typeof Primitive.Button>) {
  return <Primitive.Button aria-label="Jump to latest message" className={cn("absolute bottom-2 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-opacity inert:pointer-events-none inert:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse", className)} {...props}><ArrowDown className="size-3.5" /></Primitive.Button>
}
