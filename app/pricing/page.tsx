import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import { PageTransition } from "@/components/page-transition"
import { CheckIcon, XIcon, UsersIcon, VideoIcon, CalendarIcon, CrownIcon, ZapIcon } from "@/components/custom-icons"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the perfect plan for your study needs",
}

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with collaborative studying",
      features: [
        { name: "Instant pairing with study partners", included: true },
        { name: "25-minute Pomodoro sessions", included: true },
        { name: "Video, voice, and text chat", included: true },
        { name: "Basic subject matching", included: true },
        { name: "Up to 3 study sessions per day", included: true },
        { name: "Study session history (7 days)", included: true },
        { name: "Create study groups", included: false },
        { name: "Schedule sessions in advance", included: false },
        { name: "Advanced matching algorithm", included: false },
        { name: "Unlimited study sessions", included: false },
        { name: "Study analytics and insights", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
      icon: <ZapIcon className="w-6 h-6" />,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Unlock the full potential of collaborative learning",
      features: [
        { name: "Everything in Free", included: true },
        { name: "Create and join study groups", included: true },
        { name: "Schedule sessions in advance", included: true },
        { name: "Advanced matching algorithm", included: true },
        { name: "Unlimited study sessions", included: true },
        { name: "Extended session history (90 days)", included: true },
        { name: "Study analytics and insights", included: true },
        { name: "Custom study goals tracking", included: true },
        { name: "Priority matching", included: true },
        { name: "Screen sharing capabilities", included: true },
        { name: "Priority support", included: true },
        { name: "Early access to new features", included: true },
      ],
      cta: "Start Premium Trial",
      popular: true,
      icon: <CrownIcon className="w-6 h-6" />,
    },
  ]

  const faqs = [
    {
      question: "Can I switch from Free to Premium anytime?",
      answer:
        "Yes! You can upgrade to Premium at any time. Your account will be upgraded immediately and you'll have access to all Premium features.",
    },
    {
      question: "What happens if I cancel my Premium subscription?",
      answer:
        "You can cancel anytime. You'll continue to have Premium access until the end of your billing period, then your account will revert to the Free plan.",
    },
    {
      question: "Is there a student discount?",
      answer:
        "Yes! We offer a 50% student discount on Premium plans. Contact our support team with your student ID to get your discount code.",
    },
    {
      question: "How does the free trial work?",
      answer:
        "New users get a 14-day free trial of Premium. No credit card required. After the trial, you can choose to continue with Premium or use the Free plan.",
    },
    {
      question: "Can I use PeerPulse on multiple devices?",
      answer:
        "Yes! Both Free and Premium plans work on all your devices. Your account syncs across web, mobile, and tablet.",
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-6" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Choose Your Study Plan</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto" style={{ fontWeight: 400, lineHeight: '1.6' }}>
              Start free and upgrade when you're ready for more advanced features. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative h-full flex flex-col rounded-[32px] transition-all duration-300 ${
                    plan.popular
                      ? "border-[#0A0A0A] border-2 shadow-2xl hover:-translate-y-1"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#0A0A0A] text-white px-4 py-1 font-semibold" style={{ fontWeight: 600 }}>Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className={`p-2 rounded-full ${plan.popular ? "bg-gray-900" : "bg-gray-100"}`}>
                        <div className={plan.popular ? "text-white" : "text-gray-700"}>{plan.icon}</div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#0A0A0A]" style={{ fontWeight: 700 }}>{plan.name}</CardTitle>
                    </div>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-[#0A0A0A]" style={{ fontWeight: 700 }}>{plan.price}</span>
                      <span className="text-gray-700 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-[#3B3B3B]" style={{ fontSize: '16px', lineHeight: '1.6' }}>{plan.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          {feature.included ? (
                            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <XIcon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${feature.included ? "text-[#0A0A0A]" : "text-gray-400 line-through"}`}
                            style={{ fontWeight: feature.included ? 500 : 400 }}
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <Button
                        className={`w-full relative overflow-hidden group transition-all duration-300 ${
                          plan.popular
                            ? "bg-[#0A0A0A] text-white rounded-xl"
                            : "bg-gray-100 text-[#0A0A0A] rounded-xl hover:bg-gray-200"
                        }`}
                        style={{ fontWeight: 600 }}
                        size="lg"
                        asChild
                      >
                        <Link href={plan.name === "Free" ? "/signup" : "/signup?plan=premium"} className="inline-flex items-center justify-center">
                          {plan.popular && (
                            <>
                              <span className="absolute inset-0 bg-white rounded-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                              <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-300">{plan.cta}</span>
                            </>
                          )}
                          {!plan.popular && plan.cta}
                        </Link>
                      </Button>
                      
                      <div className="h-8 flex items-center justify-center">
                        {plan.name === "Premium" && (
                          <p className="text-xs text-gray-500 text-center">14-day free trial • No credit card required</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0A0A0A] mb-12" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Premium Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-[32px] border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>Study Groups</h3>
                <p className="text-[#3B3B3B]" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  Create and join study groups for specific subjects or courses. Collaborate with multiple students for
                  diverse perspectives and group learning.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-[32px] border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <CalendarIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>Advanced Scheduling</h3>
                <p className="text-[#3B3B3B]" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  Schedule study sessions in advance with friends or recommended partners. Set recurring sessions and
                  get reminders.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-[32px] border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <VideoIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>Screen Sharing</h3>
                <p className="text-[#3B3B3B]" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  Share your screen during study sessions to show problems, presentations, or collaborate on documents
                  in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0A0A0A] mb-12" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Frequently Asked Questions</h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-[#0A0A0A] mb-2" style={{ fontWeight: 700 }}>{faq.question}</h3>
                  <p className="text-[#3B3B3B]" style={{ fontSize: '16px', lineHeight: '1.6' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-8 px-6">
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
    </PageTransition>
  )
}
