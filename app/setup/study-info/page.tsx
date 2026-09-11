"use client"

import { PageTransition } from "@/components/page-transition"
import { StudyInfoForm } from "./study-info-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function StudyInfoPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4 py-12 font-[Lexend,_'Noto_Sans',_sans-serif]">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 text-ink-soft hover:text-ink mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-12 rounded-full transition-all ${
                    step <= 1 ? "bg-ink" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-ink-soft">Step 1 of 3</p>
          </div>

          <div className="rounded-3xl bg-surface border border-line-strong p-8 shadow-lg">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-ink">What are you studying?</h1>
              <p className="text-ink-soft mt-2">Tell us about your study goals</p>
            </div>

            <StudyInfoForm />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
