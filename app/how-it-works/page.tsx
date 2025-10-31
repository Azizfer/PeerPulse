import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { SearchIcon, ZapIcon, TimerIcon, VideoIcon } from "@/components/custom-icons"

export const metadata: Metadata = {
  title: "How PeerPulse Works",
  description: "Learn how PeerPulse connects you with the perfect study partners for collaborative learning",
}

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Click 'Get Paired'",
      description:
        "When you're ready to study, simply click the 'Get Paired' button on your dashboard. We'll instantly start looking for another student who's online and studying similar subjects.",
      icon: <ZapIcon className="w-8 h-8" />,
    },
    {
      title: "Get matched instantly",
      description:
        "Our matching system finds you a compatible study partner based on your subjects, study level, and preferences. You'll be connected within seconds.",
      icon: <SearchIcon className="w-8 h-8" />,
    },
    {
      title: "Join your study session",
      description:
        "Enter a shared Pomodoro study room with your partner. Use the built-in timer, video chat, and messaging to collaborate effectively.",
      icon: <TimerIcon className="w-8 h-8" />,
    },
    {
      title: "Study together",
      description:
        "Work through problems together, share knowledge, and keep each other motivated. Use video, voice, or text chat to communicate.",
      icon: <VideoIcon className="w-8 h-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-6" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Study Together, Learn Better
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto" style={{ fontWeight: 400, lineHeight: '1.6' }}>
            PeerPulse connects you with compatible study partners instantly. Click "Get Paired" and start a focused
            Pomodoro study session with another student right away.
          </p>
          <Button size="lg" className="relative bg-[#0A0A0A] text-white rounded-xl px-7 py-3.5 text-base font-semibold h-auto overflow-hidden group transition-all duration-300" style={{ fontWeight: 600 }} asChild>
            <Link href="/signup" className="inline-flex items-center justify-center gap-2">
              <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
              <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-300">Get Started</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:text-[#0A0A0A] transition-colors duration-300" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0A0A0A] mb-4" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>How It Works</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto text-lg" style={{ fontWeight: 400, lineHeight: '1.6' }}>
            Get paired with a study partner and start learning together in just a few clicks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] p-8 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <div className="w-8 h-8">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#0A0A0A] mb-1" style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.08em' }}>STEP {index + 1}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#0A0A0A]" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[#3B3B3B] leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.6' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0A0A0A] mb-12" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: "How long does it take to get paired?",
                answer:
                  "Most pairings happen within 30 seconds. Our system looks for online students studying similar subjects.",
              },
              {
                question: "Do I need to turn on my camera?",
                answer:
                  "No, camera use is optional. You can choose video, voice, or text chat based on your preference.",
              },
              {
                question: "Can I schedule sessions in advance?",
                answer:
                  "Yes! You can schedule sessions with specific partners at times that work for everyone.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>{faq.question}</h3>
                <p className="text-[#3B3B3B]" style={{ fontSize: '16px', lineHeight: '1.6' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-gray-800 font-medium">
              © {new Date().getFullYear()} PeerPulse. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/terms" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-gray-800 hover:text-[#0A0A0A] transition-colors font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
