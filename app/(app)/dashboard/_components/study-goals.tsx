"use client"

// Adapted from Studio Admin tasks-section.tsx (MIT).
// Copyright (c) 2024 Mohammed Arham Khan. See licenses/studio-admin-MIT.txt.
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
export type StudyGoal = { id: string; title: string; tag: string; checked: boolean }

export function StudyGoals({ items, onChange }: { items: StudyGoal[]; onChange: (items: StudyGoal[]) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState("")
  const [activeOnly, setActiveOnly] = useState(false)
  const visible = items.filter(item => !activeOnly || !item.checked)
  return <section id="study-goals" className="scroll-mt-20">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-base font-bold text-ink">A plan for today</h2><div className="flex items-center gap-1"><Button size="sm" variant="ghost" aria-pressed={activeOnly} onClick={() => setActiveOnly(value => !value)} className="h-8 px-2 text-[11px]">{activeOnly ? "Show all" : "In progress"}</Button><Button size="sm" variant="secondary" onClick={() => setShowForm(value => !value)} className="h-8 rounded-lg px-2.5 text-[11px] hover:translate-y-0">{showForm ? <X className="size-3" /> : <Plus className="size-3" />}{showForm ? "Close" : "Add goal"}</Button></div></div>
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {showForm && <form className="flex gap-2 border-b border-line p-3" onSubmit={event => { event.preventDefault(); if (!draft.trim()) return; onChange([...items, { id: crypto.randomUUID(), title: draft.trim(), tag: "Personal", checked: false }]); setDraft(""); setShowForm(false) }}><Input aria-label="New study goal" value={draft} onChange={event => setDraft(event.target.value)} placeholder="What would you like to finish?" maxLength={150} className="h-9 min-w-0 text-xs" /><Button type="submit" size="sm" variant="accent" disabled={!draft.trim()} className="h-9 rounded-lg">Add</Button></form>}
      <div className="divide-y divide-line">{visible.map(task => <label key={task.id} className="flex cursor-pointer items-center gap-3 p-4 hover:bg-surface-sunken/50"><Checkbox checked={task.checked} aria-label={task.title} onCheckedChange={checked => onChange(items.map(item => item.id === task.id ? { ...item, checked: checked === true } : item))} /><span className="min-w-0 flex-1"><span className={`block text-[13px] leading-6 ${task.checked ? "text-ink-mute line-through" : "font-medium text-ink"}`}>{task.title}</span></span><Badge variant="neutral" className="hidden shrink-0 rounded-md px-2 py-0.5 text-[9px] font-medium sm:inline-flex">{task.tag}</Badge></label>)}</div>
      {!visible.length && <p className="p-5 text-xs text-ink-mute">{activeOnly ? "All caught up. Take a well-earned break." : "Add your first goal for today."}</p>}
    </div>
  </section>
}
