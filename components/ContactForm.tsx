"use client"

import { useState } from "react"
import { Bug, CheckCircle2, Lightbulb, Mail, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Reveal } from "@/components/reveal"

const TOPICS = [
  { icon: Bug, label: "Report a bug", hint: "Something broke or behaved oddly" },
  { icon: Lightbulb, label: "Suggest a feature", hint: "Tell us what's missing" },
  { icon: MessageSquare, label: "Something else", hint: "Partnerships, press, anything" },
]

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: post this to the support endpoint once the backend exists.
    console.log("Contact form submitted:", formData)
    setSent(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <main className="container-page py-16 sm:py-20">

        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[52px]">
              Tell us what&apos;s broken
            </h1>
            <p className="mt-4 text-lead text-ink-soft">
              A small team reads every message. Expect a reply within a day or two — faster if
              something is on fire.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* ---------------- Side ---------------- */}
          <Reveal delay={0.06}>
            <div className="space-y-4">
              {TOPICS.map((topic) => (
                <div
                  key={topic.label}
                  className="flex items-start gap-4 rounded-3xl border border-line bg-surface p-5 shadow-soft"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-sunken text-ink-soft">
                    <topic.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-bold text-ink">{topic.label}</p>
                    <p className="mt-0.5 text-[14px] text-ink-mute">{topic.hint}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-3xl border border-line bg-paper-warm p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface text-pulse-dark shadow-soft">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-bold text-ink">Email us directly</p>
                    <p className="text-[14px] text-ink-mute">hello@peerpulse.app</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------------- Form ---------------- */}
          <Reveal delay={0.1}>
            <div className="rounded-[32px] border border-line bg-surface p-8 shadow-soft">
              {sent ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-pulse-soft text-pulse-dark">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-bold text-ink">Message sent</h2>
                  <p className="mt-2 max-w-xs text-[14.5px] leading-relaxed text-ink-soft">
                    Thanks — we&apos;ll get back to you at the address you gave us.
                  </p>
                  <Button variant="secondary" className="mt-7" onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Sana Benali"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@university.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's it about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="The more detail, the faster we can fix it."
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4" />
                    Send message
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </main>
  )
}
