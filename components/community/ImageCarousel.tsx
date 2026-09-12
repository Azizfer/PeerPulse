"use client"

import { useState } from "react"

interface ImageFile {
  name: string
  type: string
  url: string
}

interface ImageCarouselProps {
  images: ImageFile[]
  postId: number
}

export function ImageCarousel({ images, postId }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselKey = `${postId}-images`

  if (images.length === 0) return null

  const currentImage = images[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const handleNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-line-strong bg-surface-sunken">
      <img 
        src={currentImage.url} 
        alt={currentImage.name} 
        className="w-full max-h-96 object-contain" 
      />
      
      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-3xl font-light hover:scale-110 transition-transform drop-shadow-lg"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-3xl font-light hover:scale-110 transition-transform drop-shadow-lg"
          >
            ›
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
