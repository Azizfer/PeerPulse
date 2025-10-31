"use client"
import { X, Crown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PremiumPopupProps {
  isOpen: boolean
  onClose: () => void
  feature: string
}

export default function PremiumPopup({ isOpen, onClose, feature }: PremiumPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Premium icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature</h2>
          <p className="text-gray-600">
            {feature} is available for Premium users only. Upgrade to unlock this feature and many more!
          </p>
        </div>

        {/* Premium benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Create and manage study communities</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Advanced matching algorithm</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Unlimited study sessions</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Priority support</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Maybe Later
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
            asChild
          >
            <Link href="/pricing">Upgrade to Premium</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
