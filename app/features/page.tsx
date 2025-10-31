import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import {
  Users,
  Timer,
  Video,
  Calendar,
  BarChart3,
  MessageSquare,
  Target,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Award,
  Clock,
  UserCheck,
  FileText,
  Share2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Features - PeerPulse",
  description: "Discover all the powerful features that make PeerPulse the best platform for collaborative learning",
}

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Pairing",
      description:
        "Get matched with a study partner in seconds. Our smart algorithm finds compatible students based on your subject, level, and study preferences.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Pomodoro Timer",
      description:
        "Built-in focus timer with 25-minute study sessions and breaks. Stay productive and avoid burnout with proven time management techniques.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video & Voice Chat",
      description:
        "Communicate seamlessly with high-quality video calls, voice chat, or text messaging. Choose the mode that works best for you.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Study Groups",
      description:
        "Create or join study groups for ongoing collaboration. Perfect for exam prep, project work, or regular study sessions with peers.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Scheduled Sessions",
      description:
        "Plan ahead with scheduled study sessions. Set up recurring meetings or one-time sessions that fit your schedule.",
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Monitor your study time, session count, and learning progress. Visualize your improvement with detailed statistics and charts.",
      color: "bg-indigo-50 text-indigo-600",
    },
  ]

  const additionalFeatures = [
    {
      icon: <Share2 className="w-6 h-6 text-blue-600" />,
      title: "Screen Sharing",
      description: "Share your screen to explain concepts, review materials, or work on problems together in real-time.",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Collaborative Notes",
      description: "Take notes together during sessions. Edit, save, and share your study notes with your partners.",
    },
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Study Goals",
      description: "Set and track your study goals. Stay motivated with clear objectives and milestone tracking.",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: "Direct Messaging",
      description: "Chat with your study partners anytime. Coordinate sessions, share resources, or ask quick questions.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      title: "Smart Matching",
      description: "Our algorithm matches you with compatible students based on subject, skill level, and study habits.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Resource Library",
      description: "Access shared study materials, flashcards, and resources contributed by the community.",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Safe & Secure",
      description: "Verified student accounts, moderated sessions, and privacy controls to ensure a safe learning environment.",
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: "Global Community",
      description: "Connect with students worldwide. Learn from diverse perspectives and study methods.",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      title: "Achievements",
      description: "Earn badges and rewards for consistent study habits, helping others, and reaching milestones.",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "24/7 Availability",
      description: "Study anytime, day or night. There's always someone online ready to learn with you.",
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f5f1e8] font-[Lexend,_'Noto_Sans',_sans-serif]">
        <Header />

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Study Better
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              PeerPulse combines powerful collaboration tools with smart matching to create the ultimate study experience. 
              Discover all the features that make learning together more effective and enjoyable.
            </p>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Even More Features</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We've thought of everything to make your study sessions productive, engaging, and effective.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 bg-[#fdfcfa] rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Transform Your Study Habits?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of students who are already learning better together with PeerPulse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-[#fdfcfa] hover:text-blue-600"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-300 bg-[#f5f1e8] py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} PeerPulse. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
