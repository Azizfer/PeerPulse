import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/components/auth-provider"
import { PiPProvider } from "@/contexts/pip-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Self-hosted (via `@fontsource`) so the app never depends on a third-party
// font CDN at build or run time.
import "@fontsource-variable/inter"
import "@fontsource-variable/plus-jakarta-sans"
import "@fontsource/instrument-serif/400.css"
import "@fontsource/instrument-serif/400-italic.css"

export const metadata: Metadata = {
  title: {
    default: "PeerPulse — study with people who get it",
    template: "%s · PeerPulse",
  },
  description:
    "PeerPulse pairs you with students taking the same subjects, gives you a quiet focus room with camera and mic, and keeps your community and resources in one calm place.",
  keywords: [
    "study together",
    "study partner",
    "peer learning",
    "body doubling",
    "focus room",
    "student community",
  ],
  openGraph: {
    title: "PeerPulse — study with people who get it",
    description:
      "Get matched with peers in your subjects, run 25-minute focus sessions on camera, and share resources in your community.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <AuthProvider>
          <PiPProvider>{children}</PiPProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
