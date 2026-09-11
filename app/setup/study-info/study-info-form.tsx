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
      <div className="px-4">
        <Label className="text-base font-medium text-ink mb-3 block">What's your main study goal?</Label>
        <Textarea
          placeholder="e.g., Pass my exams, Master programming, Improve my grades..."
          value={formData.studyGoal}
          onChange={(e) => setFormData((prev) => ({ ...prev, studyGoal: e.target.value }))}
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Subjects */}
      <div className="px-4">
        <Label className="text-base font-medium text-ink mb-3 block">What subjects are you studying?</Label>

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
          <p className="text-sm text-ink-soft mb-2">Or select from popular subjects:</p>
          <div className="flex flex-wrap gap-2">
            {popularSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => addSubject(subject)}
                disabled={formData.subjects.includes(subject)}
                className="px-3 py-1 text-xs border border-line-strong rounded-full hover:border-blue-400 hover:text-pulse-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Selected subjects */}
        {formData.subjects.length > 0 && (
          <div>
            <p className="text-sm text-ink-soft mb-2">Selected subjects:</p>
            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                  {subject}
                  <button type="button" onClick={() => removeSubject(subject)} className="ml-1 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end items-center px-4 py-3">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="bg-ink hover:bg-[#1a1612] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step →
        </Button>
      </div>

      {/* Form validation feedback */}
      {!isFormValid && (
        <div className="px-4">
          <p className="text-sm text-ink-mute text-center">
            Please fill in your study goal and select at least one subject
          </p>
        </div>
      )}
    </motion.form>
  )
}
