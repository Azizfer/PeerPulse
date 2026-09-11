"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Minus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RevealGroup, RevealItem } from "@/components/reveal"

const PLANS = [
  {
    name: "Free",
    tagline: "Enough to see whether this works for you.",
    monthly: "$0",
    yearly: "$0",
    period: "forever",
    cta: "Create free account",
    href: "/signup",
    features: [
      { name: "Subject-matched pairing", included: true },
      { name: "25-minute focus rooms", included: true },
      { name: "Video, voice and chat", included: true },
      { name: "Up to 3 sessions a day", included: true },
      { name: "Session history (7 days)", included: true },
      { name: "Community feed access", included: true },
      { name: "Schedule sessions in advance", included: false },
      { name: "Unlimited sessions", included: false },
      { name: "Study analytics", included: false },
      { name: "Pulse AI study plans", included: false },
    ],
  },
  {
    name: "Premium",
    tagline: "For exam season, and the weeks before it.",
    monthly: "$9.99",
    yearly: "$4.99",
    period: "per month",
    cta: "Start 14-day trial",
    href: "/signup?plan=premium",
    popular: true,
    features: [
      { name: "Everything in Free", included: true },
      { name: "Schedule sessions in advance", included: true },
      { name: "Unlimited sessions", included: true },
      { name: "Priority matching", included: true },
      { name: "Study groups up to 8 people", included: true },
      { name: "Session history (90 days)", included: true },
      { name: "Study analytics and insights", included: true },
      { name: "Pulse AI study plans", included: true },
      { name: "Screen sharing", included: true },
      { name: "Early access to new features", included: true },
    ],
  },
]

export function PricingPlans() {
  const [yearly, setYearly] = useState(false)

  return (
    <div className="container-page">
      <div className="mb-10 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-soft">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
              !yearly ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
              yearly ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            Yearly
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                yearly ? "bg-white/15 text-white" : "bg-pulse-soft text-pulse-dark"
              }`}
            >
              \u221250%
            </span>
          </button>
        </div>
      </div>

      <RevealGroup className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <RevealItem key={plan.name} className="h-full">
            <div
              className={`relative flex h-full flex-col rounded-[32px] p-8 transition-all duration-300 sm:p-9 ${
                plan.popular
                  ? "bg-ink text-white shadow-lift"
                  : "border border-line bg-surface text-ink shadow-soft hover:border-line-strong hover:shadow-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pulse px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-[-0.025em]">
                  {plan.name}
                </h2>
                <p
                  className={`mt-2 text-[15px] leading-relaxed ${
                    plan.popular ? "text-white/65" : "text-ink-soft"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <span className="font-display text-5xl font-extrabold leading-none tracking-tight">
                    {yearly ? plan.yearly : plan.monthly}
                  </span>
                  <span className={`pb-1 text-[14px] ${plan.popular ? "text-white/60" : "text-ink-mute"}`}>
                    /{plan.period}
                  </span>
                </div>
                {yearly && plan.name === "Premium" && (
                  <p className="mt-2 text-[13px] text-pulse">Billed annually \u00b7 $59.88 a year</p>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <span
                        className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${
                          plan.popular ? "bg-white/15 text-pulse" : "bg-pulse-soft text-pulse-dark"
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3.5} />
                      </span>
                    ) : (
                      <span
                        className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${
                          plan.popular ? "bg-white/10 text-white/35" : "bg-surface-sunken text-ink-faint"
                        }`}
                      >
                        <Minus className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={`text-[14.5px] leading-snug ${
                        feature.included
                          ? plan.popular
                            ? "text-white/90"
                            : "text-ink"
                          : plan.popular
                            ? "text-white/40 line-through"
                            : "text-ink-faint line-through"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button
                  asChild
                  size="lg"
                  className={`w-full ${plan.popular ? "bg-white text-ink hover:bg-white/90" : ""}`}
                  variant={plan.popular ? "default" : "secondary"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
                {plan.popular && (
                  <p className="mt-3 text-center text-[13px] text-white/50">
                    14-day free trial \u00b7 no card required
                  </p>
                )}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <p className="mt-8 text-center text-[14px] text-ink-mute">
        Verified students get 50% off Premium automatically \u2014 no code needed.
      </p>
    </div>
  )
}
