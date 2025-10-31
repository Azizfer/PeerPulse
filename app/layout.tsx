import type React from "react"
import type { Metadata } from "next"
import { Inter, Lexend, Noto_Sans } from 'next/font/google' 
import { AuthProvider } from "@/components/auth-provider"
import { PiPProvider } from "@/contexts/pip-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" })
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-noto" })

export const metadata: Metadata = {
  title: {
    default: "PeerPulse",
    template: "%s | PeerPulse",
  },
  description:
    "Connect with fellow students, control your camera settings, and store your study resources all in one place.",
  keywords: ["study", "students", "collaboration", "education", "learning"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"><head /><body className={`${inter.variable} ${lexend.variable} ${notoSans.variable}`}>
        <AuthProvider>
          <PiPProvider>
            {children}
          </PiPProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
