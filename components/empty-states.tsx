"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, Calendar, MessageCircle, TrendingUp } from 'lucide-react'
import Link from "next/link"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed border border-line">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 bg-surface-sunken rounded-full flex items-center justify-center mb-4">
          <div className="text-ink-faint">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
        <p className="text-ink-soft mb-6 max-w-sm">{description}</p>
        {action && (
          <>
            {action.href ? (
              <Button asChild className="bg-pulse hover:bg-pulse-dark">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick} className="bg-pulse hover:bg-pulse-dark">
                {action.label}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function NoStudySessionsEmpty() {
  return (
    <EmptyState
      icon={<Calendar className="w-8 h-8" />}
      title="No study sessions yet"
      description="Start your first study session to see your progress and connect with study partners."
      action={{
        label: "Start Studying",
        href: "/study"
      }}
    />
  )
}

export function NoStudyPartnersEmpty() {
  return (
    <EmptyState
      icon={<Users className="w-8 h-8" />}
      title="No study partners found"
      description="Complete your profile setup to get matched with compatible study partners."
      action={{
        label: "Complete Profile",
        href: "/setup"
      }}
    />
  )
}

export function NoCommunitiesEmpty() {
  return (
    <EmptyState
      icon={<BookOpen className="w-8 h-8" />}
      title="No communities available"
      description="Study communities are created by Premium users. Upgrade to create your own community."
      action={{
        label: "Upgrade to Premium",
        href: "/pricing"
      }}
    />
  )
}

export function NoMessagesEmpty() {
  return (
    <EmptyState
      icon={<MessageCircle className="w-8 h-8" />}
      title="No messages yet"
      description="Start a conversation with your study partners to collaborate and share ideas."
    />
  )
}

export function NoStatsEmpty() {
  return (
    <EmptyState
      icon={<TrendingUp className="w-8 h-8" />}
      title="No statistics available"
      description="Complete a few study sessions to see your progress and analytics here."
      action={{
        label: "Start Your First Session",
        href: "/study"
      }}
    />
  )
}
