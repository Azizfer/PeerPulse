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
      <div>
        <Label className="mb-2.5 block text-[14.5px] font-semibold text-ink">University / Institution</Label>
        <Input
          placeholder="e.g., Stanford University, MIT..."
          value={formData.university}
          onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
          className="h-12"
        />
      </div>

      {/* Major */}
      <div>
        <Label className="mb-2.5 block text-[14.5px] font-semibold text-ink">Major / Field of Study</Label>
        <Input
          placeholder="e.g., Computer Science, Biology..."
          value={formData.major}
          onChange={(e) => setFormData((prev) => ({ ...prev, major: e.target.value }))}
          className="h-12"
        />
      </div>

      {/* Academic Year */}
      <div>
        <Label className="mb-2.5 block text-[14.5px] font-semibold text-ink">Current Academic Year</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {academicYears.map((year) => (
            <label
              key={year.value}
              className={`relative flex h-12 cursor-pointer items-center justify-center rounded-2xl border px-4 font-display text-[14px] font-semibold transition-all ${
                formData.academicYear === year.value
                  ? "border-2 border-pulse bg-pulse-soft text-pulse-dark"
                  : "border-line-strong text-ink-soft hover:border-ink-faint"
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
      <div className="flex items-center justify-end pt-1">
        <Button
          type="button"
          onClick={handleComplete}
          disabled={!isFormValid || isCompleting}
          className="w-full sm:w-auto"
        >
          {isCompleting ? "Finishing..." : "Complete Setup"}
        </Button>
      </div>

      {/* Form validation feedback */}
      {!isFormValid && (
        <div>
          <p className="text-center text-[13px] text-ink-mute">
            Please fill in all fields to continue
          </p>
        </div>
      )}
    </motion.form>
  )
}
