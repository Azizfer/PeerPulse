"use client"
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as AvatarGroupPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
/**
 * shadcn-style Avatar, extended with the extra compound parts PeerPulse needs:
 * AvatarBadge (presence dot), AvatarGroup and AvatarGroupCount.
 *
 * The older wordmark-era avatar lives at `@/components/avatar` and is still used
 * by legacy pages; this one is the standard component going forward.
 */
/* -------------------------------------------------------------------------- */
/*  Avatar                                                                     */
/* -------------------------------------------------------------------------- */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  )
}
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  )
}
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}
/* -------------------------------------------------------------------------- */
/*  AvatarBadge — presence dot                                                 */
/* -------------------------------------------------------------------------- */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-primary absolute right-0 bottom-0 z-10 size-2 rounded-full ring-2 ring-background",
        className,
      )}
      {...props}
    />
  )
}
/* -------------------------------------------------------------------------- */
/*  AvatarGroup — overlapping stack                                            */
/* -------------------------------------------------------------------------- */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2",
        className,
      )}
      {...props}
    />
  )
}
function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-muted text-muted-foreground relative flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ring-2 ring-background",
        className,
      )}
      {...props}
    />
  )
}
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarGroupPrimitive,
}