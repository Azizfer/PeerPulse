"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" data-slot="input-group" className={cn("flex min-w-0 items-end rounded-xl border border-line-strong bg-surface p-1 shadow-soft focus-within:border-pulse focus-within:ring-2 focus-within:ring-pulse/10", className)} {...props} />
}
export function InputGroupAddon({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-group-addon" className={cn("flex shrink-0 items-center p-0.5", className)} {...props} />
}
export function InputGroupButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button size="icon-sm" type="button" data-slot="input-group-button" className={cn("size-7 rounded-lg p-0 hover:translate-y-0 [&_svg]:size-3.5", className)} {...props} />
}
export const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => <textarea ref={ref} data-slot="input-group-control" className={cn("block min-h-8 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-1.5 text-[13px] leading-5 text-ink outline-none placeholder:text-ink-mute", className)} {...props} />,
)
InputGroupTextarea.displayName = "InputGroupTextarea"
