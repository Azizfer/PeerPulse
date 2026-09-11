import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, bugs, or ideas for PeerPulse.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <ContactForm />
      <Footer />
    </div>
  )
}
