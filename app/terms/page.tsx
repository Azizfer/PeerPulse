import Header from "@/components/Header"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="bg-[#fdfcfa] rounded-2xl shadow-sm border-2 border-gray-300 p-8 space-y-6">
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using PeerPulse, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700">
              Permission is granted to temporarily use PeerPulse for personal, non-commercial study purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
            <p className="text-gray-700">
              You agree to use PeerPulse respectfully and not to harass, abuse, or harm other users. Violations may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Account Termination</h2>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact</h2>
            <p className="text-gray-700">
              For questions about these Terms, please contact us at{" "}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                our contact page
              </Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
