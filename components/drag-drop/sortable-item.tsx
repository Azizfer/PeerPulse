"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from 'lucide-react'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function SortableItem({ id, children, className = "" }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${
        isDragging 
          ? "opacity-50 scale-105 shadow-2xl z-50 rotate-2" 
          : "hover:shadow-md"
      } transition-all duration-200 group`}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <button
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-surface-sunken rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-ink-faint" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
