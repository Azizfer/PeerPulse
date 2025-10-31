"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Pen, Eraser, Square, Circle, Trash2, Download, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DrawingPoint {
  x: number
  y: number
  color: string
  size: number
  tool: 'pen' | 'eraser'
  userId: string
}

interface DrawingStroke {
  id: string
  points: DrawingPoint[]
  userId: string
  userName: string
  timestamp: Date
}

export function SharedWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen')
  const [currentColor, setCurrentColor] = useState('#3B82F6')
  const [currentSize, setCurrentSize] = useState(3)
  const [strokes, setStrokes] = useState<DrawingStroke[]>([])
  const [collaborators, setCollaborators] = useState<string[]>(['Alex', 'Sarah'])

  // Simulate collaborative drawing
  useEffect(() => {
    const simulateCollaborativeDrawing = () => {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance of collaborative drawing
          const canvas = canvasRef.current
          if (!canvas) return

          const ctx = canvas.getContext('2d')
          if (!ctx) return

          const colors = ['#10B981', '#F59E0B', '#EF4444']
          const color = colors[Math.floor(Math.random() * colors.length)]
          const startX = Math.random() * canvas.width
          const startY = Math.random() * canvas.height

          // Draw a simple shape
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(startX, startY, 20, 0, 2 * Math.PI)
          ctx.stroke()

          // Add to strokes for persistence
          const newStroke: DrawingStroke = {
            id: Date.now().toString(),
            points: [
              { x: startX, y: startY, color, size: 2, tool: 'pen', userId: 'collaborator' }
            ],
            userId: 'collaborator',
            userName: collaborators[Math.floor(Math.random() * collaborators.length)],
            timestamp: new Date()
          }

          setStrokes(prev => [...prev, newStroke])
        }
      }, 8000)

      return () => clearInterval(interval)
    }

    const cleanup = simulateCollaborativeDrawing()
    return cleanup
  }, [collaborators])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineWidth = currentSize
    ctx.lineCap = 'round'
    
    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = currentColor
    } else {
      ctx.globalCompositeOperation = 'destination-out'
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setStrokes([])
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pen className="w-5 h-5" />
            Shared Whiteboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <Badge variant="secondary" className="text-xs">{collaborators.length + 1} active</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          {/* Tools */}
          <div className="flex gap-2">
            <Button
              variant={currentTool === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('pen')}
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('eraser')}
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          {/* Colors */}
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  currentColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>

          {/* Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={currentSize}
              onChange={(e) => setCurrentSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-6">{currentSize}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCanvas}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-auto cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          
          {/* Collaborative indicators */}
          <div className="absolute top-2 right-2 flex gap-1">
            {collaborators.map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded-full"
              >
                {name} is drawing
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-500 text-center">
          Draw, sketch, and collaborate in real-time with your study partners
        </div>
      </CardContent>
    </Card>
  )
}
