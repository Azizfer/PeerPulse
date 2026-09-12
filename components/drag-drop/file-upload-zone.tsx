"use client"

import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FileUploadZoneProps {
  onFilesUploaded?: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
  maxSize?: number
}

export function FileUploadZone({ 
  onFilesUploaded, 
  maxFiles = 5, 
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles)
    setUploadedFiles(newFiles)
    onFilesUploaded?.(newFiles)
    
    toast({
      title: "Files uploaded! 📁",
      description: `${acceptedFiles.length} file(s) added successfully`,
      variant: "success"
    })
  }, [uploadedFiles, maxFiles, onFilesUploaded, toast])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length
  })

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesUploaded?.(newFiles)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive && !isDragReject 
            ? 'border-pulse bg-pulse-soft scale-105 shadow-lg' 
            : isDragReject 
            ? 'border-rose-deep bg-rose' 
            : 'border-line-strong hover:border-ink-faint hover:bg-surface-sunken'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
            isDragActive && !isDragReject 
              ? 'text-pulse' 
              : isDragReject 
              ? 'text-rose-deep' 
              : 'text-ink-faint'
          }`} />
          
          {isDragActive ? (
            isDragReject ? (
              <p className="font-medium text-rose-deep">
                Some files are not supported
              </p>
            ) : (
              <p className="font-medium text-pulse-dark">
                Drop your files here! ✨
              </p>
            )
          ) : (
            <div>
              <p className="text-ink-soft font-medium mb-2">
                Drag & drop your study materials here
              </p>
              <p className="text-sm text-ink-mute mb-4">
                or click to browse files
              </p>
              <p className="text-xs text-ink-faint">
                Supports: {acceptedFileTypes.join(', ')} • Max {maxFiles} files • {Math.round(maxSize / 1024 / 1024)}MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-ink">Uploaded files</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-surface-sunken p-3 transition-colors duration-200 hover:bg-line animate-in fade-in-0 slide-in-from-left-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CheckCircle className="h-4 w-4 text-pulse" />
              <File className="w-4 h-4 text-ink-mute" />
              <span className="flex-1 text-sm text-ink-soft truncate">
                {file.name}
              </span>
              <span className="text-xs text-ink-mute">
                {Math.round(file.size / 1024)}KB
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <X className="w-3 h-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
