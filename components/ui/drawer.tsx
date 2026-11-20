"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Responsive drawer built on the same accessible dialog primitive as our sheets.
export const Drawer = Dialog.Root
export const DrawerTrigger = Dialog.Trigger
export const DrawerClose = Dialog.Close

export function DrawerContent({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Content>) {
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const swipeStart = React.useRef<number | null>(null)
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
      <Dialog.Content
        className={cn(
          "fixed inset-x-2 bottom-2 z-50 flex max-h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-[28px] border border-line bg-surface text-ink shadow-lift outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-200 motion-reduce:animate-none",
          "sm:inset-x-auto sm:inset-y-3 sm:right-3 sm:w-[440px] sm:max-w-[calc(100vw-24px)] sm:max-h-none sm:data-[state=open]:slide-in-from-right-4 sm:data-[state=closed]:slide-out-to-right-4 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:slide-out-to-bottom-0",
          className,
        )}
        {...props}
      >
        <div className="flex shrink-0 touch-none justify-center pb-1 pt-3 sm:hidden"
          onPointerDown={event => { swipeStart.current = event.clientY; event.currentTarget.setPointerCapture(event.pointerId) }}
          onPointerUp={event => { if (swipeStart.current !== null && event.clientY - swipeStart.current > 50) closeRef.current?.click(); swipeStart.current = null }}
          onPointerCancel={() => { swipeStart.current = null }}
          aria-hidden="true">
          <span className="h-1 w-9 rounded-full bg-line-strong" />
        </div>
        {children}
        <Dialog.Close ref={closeRef} className="absolute right-4 top-5 grid size-8 place-items-center rounded-full border border-line bg-surface text-ink-mute transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse">
          <X className="size-3.5" strokeWidth={1.8} />
          <span className="sr-only">Close drawer</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("shrink-0 space-y-1.5 border-b border-line p-5 pr-14 text-left", className)} {...props} />
}
export function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5", className)} {...props} />
}
export function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex shrink-0 flex-col gap-2 border-t border-line bg-surface p-4 pb-[max(16px,env(safe-area-inset-bottom))]", className)} {...props} />
}
export function DrawerTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Title>) {
  return <Dialog.Title className={cn("font-display text-xl font-bold tracking-tight text-ink", className)} {...props} />
}
export function DrawerDescription({ className, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Description>) {
  return <Dialog.Description className={cn("text-xs leading-6 text-ink-soft", className)} {...props} />
}
