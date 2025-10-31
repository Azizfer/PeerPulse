"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface AcademicInfoData {
  university: string
  major: string
  academicYear: string
}

const academicYears = [
  { value: "freshman", label: "Freshman / Year 1" },
  { value: "sophomore", label: "Sophomore / Year 2" },
  { value: "junior", label: "Junior / Year 3" },
  { value: "senior", label: "Senior / Year 4" },
  { value: "graduate", label: "Graduate Student" },
  { value: "other", label: "Other" },
]

export function AcademicInfoFormSimple() {
  const [formData, setFormData] = useState<AcademicInfoData>({
    university: "",
    major: "",
    academicYear: "",
  })
  const [isCompleting, setIsCompleting] = useState(false)

  const isFormValid = formData.university && formData.major && formData.academicYear

  const handleComplete = async () => {
    if (isFormValid) {
      setIsCompleting(true)
      
      console.log("Academic info data:", formData)
      console.log("Applying smart defaults for other settings...")
      
      // TODO: Save to database with smart defaults:
      // - theme: "light"
      // - preferredStudyTime: "flexible"
      // - collaborationStyle: "flexible"
      // - sessionLength: 60
      // - communicationMethods: ["video", "voice", "chat"]
      // - profileVisibility: "public"
      // - findStudyPartners: true
      // - notifications: all enabled
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      window.location.href = "/setup/complete"
    }
  }

  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* University */}
      <div className="px-4">
        <Label className="text-base font-medium text-gray-900 mb-3 block">University / Institution</Label>
        <Input
          placeholder="e.g., Stanford University, MIT..."
          value={formData.university}
          onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
          className="h-12"
        />
      </div>

      {/* Major */}
      <div className="px-4">
        <Label className="text-base font-medium text-gray-900 mb-3 block">Major / Field of Study</Label>
        <Input
          placeholder="e.g., Computer Science, Biology..."
          value={formData.major}
          onChange={(e) => setFormData((prev) => ({ ...prev, major: e.target.value }))}
          className="h-12"
        />
      </div>

      {/* Academic Year */}
      <div className="px-4">
        <Label className="text-base font-medium text-gray-900 mb-3 block">Current Academic Year</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {academicYears.map((year) => (
            <label
              key={year.value}
              className={`relative flex h-12 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-medium transition-all ${
                formData.academicYear === year.value
                  ? "border-blue-600 border-2 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {year.label}
              <input
                type="radio"
                name="academicYear"
                className="absolute invisible"
                value={year.value}
                checked={formData.academicYear === year.value}
                onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end items-center px-4 py-3">
        <Button
          type="button"
          onClick={handleComplete}
          disabled={!isFormValid || isCompleting}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
        >
          {isCompleting ? "Finishing..." : "Complete Setup"}
        </Button>
      </div>

      {/* Form validation feedback */}
      {!isFormValid && (
        <div className="px-4">
          <p className="text-sm text-gray-500 text-center">
            Please fill in all fields to continue
          </p>
        </div>
      )}
    </motion.form>
  )
}
