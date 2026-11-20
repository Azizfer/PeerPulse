"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { motion } from "framer-motion"

interface StudyInfoData {
  studyGoal: string
  subjects: string[]
  currentSubject: string
}

const popularSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Psychology",
  "Economics",
  "Art",
  "Business",
  "Engineering",
]

export function StudyInfoForm() {
  const [formData, setFormData] = useState<StudyInfoData>({
    studyGoal: "",
    subjects: [],
    currentSubject: "",
  })

  const isFormValid = formData.studyGoal && formData.subjects.length > 0

  const addSubject = (subject: string) => {
    if (subject && !formData.subjects.includes(subject)) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subject],
        currentSubject: "",
      }))
    }
  }

  const removeSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }))
  }

  const handleSubmit = () => {
    if (isFormValid) {
      console.log("Study info data:", formData)
      // TODO: Save to database or state management
      window.location.href = "/setup/academic-info"
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
      {/* Study Goal */}
      <div>
        <Label className="mb-2.5 block text-[14.5px] font-semibold text-ink">What's your main study goal?</Label>
        <Textarea
          placeholder="e.g., Pass my exams, Master programming, Improve my grades..."
          value={formData.studyGoal}
          onChange={(e) => setFormData((prev) => ({ ...prev, studyGoal: e.target.value }))}
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Subjects */}
      <div>
        <Label className="mb-2.5 block text-[14.5px] font-semibold text-ink">What subjects are you studying?</Label>

        {/* Add custom subject */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a subject..."
            value={formData.currentSubject}
            onChange={(e) => setFormData((prev) => ({ ...prev, currentSubject: e.target.value }))}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSubject(formData.currentSubject)
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addSubject(formData.currentSubject)}
            disabled={!formData.currentSubject}
            variant="outline"
          >
            Add
          </Button>
        </div>

        {/* Popular subjects */}
        <div className="mb-4">
          <p className="mb-2.5 text-[13.5px] text-ink-mute">Or select from popular subjects:</p>
          <div className="flex flex-wrap gap-2">
            {popularSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => addSubject(subject)}
                disabled={formData.subjects.includes(subject)}
                className="rounded-full border border-line-strong px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-pulse hover:text-pulse-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Selected subjects */}
        {formData.subjects.length > 0 && (
          <div>
            <p className="mb-2.5 text-[13.5px] text-ink-mute">Selected subjects:</p>
            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                  {subject}
                  <button type="button" onClick={() => removeSubject(subject)} className="ml-1 hover:text-rose-deep">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end pt-1">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full sm:w-auto"
        >
          Next Step →
        </Button>
      </div>

      {/* Form validation feedback */}
      {!isFormValid && (
        <div>
          <p className="text-center text-[13px] text-ink-mute">
            Please fill in your study goal and select at least one subject
          </p>
        </div>
      )}
    </motion.form>
  )
}
