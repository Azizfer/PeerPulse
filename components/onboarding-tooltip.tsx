"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[]
  onComplete: () => void
  isVisible: boolean
}

export function OnboardingTooltip({ steps, onComplete, isVisible }: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!isVisible || !steps[currentStep]) return

    const targetElement = document.querySelector(steps[currentStep].target)
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      const step = steps[currentStep]
      
      let top = 0
      let left = 0

      switch (step.position) {
        case 'top':
          top = rect.top - 10
          left = rect.left + rect.width / 2
          break
        case 'bottom':
          top = rect.bottom + 10
          left = rect.left + rect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2
          left = rect.left - 10
          break
        case 'right':
          top = rect.top + rect.height / 2
          left = rect.right + 10
          break
      }

      setTooltipPosition({ top, left })
    }
  }, [currentStep, steps, isVisible])

  if (!isVisible || !steps[currentStep]) return null

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-80 shadow-lg"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -100%)'
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-ink mb-1">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-ink-soft">
                {steps[currentStep].description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-pulse' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSkip}>
                Skip
              </Button>
              <Button size="sm" onClick={handleNext} className="bg-pulse hover:bg-pulse-dark">
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
