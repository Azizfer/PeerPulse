"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Document, Page } from 'react-pdf'

// pdf.js needs its worker; these modules are only ever loaded client-side.
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFFile {
  name: string
  type: string
  url: string
}

interface PDFPreviewProps {
  pdf: PDFFile
  postId: number
  pdfIndex: number
  onPageClick: (page: number, numPages: number) => void
}

export function PDFPreview({ pdf, postId, pdfIndex, onPageClick }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pdfKey = `${postId}-pdf-${pdfIndex}`

  return (
    <div className="rounded-lg border border-line-strong bg-surface overflow-hidden">
      {/* PDF Header */}
      <div className="flex items-center justify-between p-3 border-b-2 border-line-strong">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-pulse-dark" />
          <span className="text-sm font-medium text-ink">{pdf.name}</span>
        </div>
        {numPages > 0 && (
          <span className="text-xs text-ink-soft">{numPages} pages</span>
        )}
      </div>
      
      {/* Single Page Preview with Navigation */}
      <div className="p-4 bg-surface-sunken">
        <Document
          file={pdf.url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="text-center py-8 text-ink-mute text-sm">
              Loading PDF...
            </div>
          }
        >
          {numPages > 0 && (
            <div className="relative">
              {/* Current Page Preview */}
              <button
                onClick={() => onPageClick(currentPage, numPages)}
                className="relative group cursor-pointer rounded-lg overflow-hidden border border-line-strong hover:border-blue-500 transition-all bg-surface w-full"
              >
                <div className="flex items-center justify-center bg-surface-sunken p-4">
                  <Page
                    pageNumber={currentPage}
                    width={280}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-pulse/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-pulse text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                    View Full Page
                  </div>
                </div>
                
                {/* Page Number Badge */}
                <div className="absolute top-3 right-3 bg-pulse text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                  Page {currentPage}
                </div>
              </button>
              
              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-ink-soft text-2xl font-light hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                <span className="text-sm text-ink-soft font-medium min-w-[80px] text-center">
                  {currentPage} / {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage === numPages}
                  className="text-ink-soft text-2xl font-light hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </Document>
      </div>
    </div>
  )
}
