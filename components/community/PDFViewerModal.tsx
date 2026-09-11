"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, ZoomIn, ZoomOut, Download } from "lucide-react"
import { FileText } from "lucide-react"
import { Document, Page } from 'react-pdf'

// pdf.js needs its worker; these modules are only ever loaded client-side.
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerModalProps {
  isOpen: boolean
  pdfUrl: string
  pdfName: string
  initialPage: number
  numPages: number
  onClose: () => void
}

export function PDFViewerModal({ isOpen, pdfUrl, pdfName, initialPage, numPages, onClose }: PDFViewerModalProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [zoom, setZoom] = useState(1.0)

  // Reset zoom when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1.0)
      setCurrentPage(initialPage)
    }
  }, [isOpen, initialPage])

  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-4 md:inset-8 bg-surface rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-line-strong bg-surface-sunken">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-pulse-dark" />
            <div>
              <h3 className="font-bold text-ink">{pdfName}</h3>
              <p className="text-xs text-ink-soft">Page {currentPage}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PDF Viewer with Zoom */}
        <div className="flex-1 overflow-hidden bg-gray-900 flex flex-col relative">
          {/* Zoom Controls Bar */}
          <div className="flex items-center justify-between gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-gray-300" />
              </button>
              <span className="text-gray-300 text-sm font-medium min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-gray-300" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-2 py-1 hover:bg-gray-700 rounded text-gray-300 text-xs transition-colors"
              >
                Reset
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-gray-300 text-sm font-medium">
                Page {currentPage} / {numPages}
              </div>
              <a
                href={pdfUrl}
                download={pdfName}
                className="flex items-center gap-2 px-3 py-2 bg-pulse hover:bg-pulse-dark text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
          
          {/* Scrollable PDF Pages */}
          <div className="flex-1 overflow-auto relative">
            <div className="min-h-full flex items-start justify-center p-6">
              <Document
                file={pdfUrl}
                loading={
                  <div className="text-white text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                    Loading PDF...
                  </div>
                }
              >
                {/* Current Page */}
                <div className="bg-surface shadow-2xl rounded">
                  <Page
                    pageNumber={currentPage}
                    scale={zoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </Document>
            </div>
            
            {/* Navigation Arrows */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="fixed left-4 top-1/2 -translate-y-1/2 text-white text-5xl font-light hover:scale-110 transition-transform drop-shadow-2xl z-10"
              >
                ‹
              </button>
            )}
            {currentPage < numPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="fixed right-4 top-1/2 -translate-y-1/2 text-white text-5xl font-light hover:scale-110 transition-transform drop-shadow-2xl z-10"
              >
                ›
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
