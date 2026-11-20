# Studio Admin integration

PeerPulse adapts the MIT-licensed Studio Admin application shell and productivity
dashboard compositions from https://github.com/arhamkhnz/next-shadcn-admin-dashboard.
Copyright (c) 2024 Mohammed Arham Khan. See ../licenses/studio-admin-MIT.txt.

Upstream source references:

- src/app/(main)/dashboard/layout.tsx: inset workspace and compact header.
- src/app/(main)/dashboard/productivity/page.tsx: primary content and supporting rail.
- src/app/(main)/dashboard/productivity/_components/summary-cards.tsx:
  adapted in app/(app)/dashboard/_components/study-summary.tsx.
- src/app/(main)/dashboard/productivity/_components/tasks-section.tsx:
  adapted in app/(app)/dashboard/_components/study-goals.tsx.
- src/app/(main)/dashboard/productivity/_components/focus-card.tsx:
  adapted in the dashboard focus card.

Components use PeerPulse's existing Next.js 15, Radix/shadcn components and routes.
The upstream Next.js 16 application, authentication, demo business data, and
preference-store infrastructure are not substituted for PeerPulse's functionality.
Workspace styling is scoped to the authenticated layout, preserving marketing pages.
