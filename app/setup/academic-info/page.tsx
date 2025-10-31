"use client"

import { PageTransition } from "@/components/page-transition"
import { AcademicInfoFormSimple } from "./academic-info-form-simple"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AcademicInfoPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4 py-12 font-[Lexend,_'Noto_Sans',_sans-serif]">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            href="/setup/study-info" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
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
                    step <= 2 ? "bg-[#2a2622]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Step 2 of 3</p>
          </div>

          <div className="rounded-3xl bg-white border-2 border-gray-300 p-8 shadow-lg">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Academic Background</h1>
              <p className="text-gray-600 mt-2">Tell us about your education</p>
            </div>

            <AcademicInfoFormSimple />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
