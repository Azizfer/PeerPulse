"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FocusTimer() {
  const [duration, setDuration] = useState(25)
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const deadline = useRef(0)
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setSeconds(remaining)
      if (!remaining) { setRunning(false); setComplete(true) }
    }, 250)
    return () => window.clearInterval(timer)
  }, [running])
  const reset = (nextMode = mode, minutes = duration) => { setRunning(false); setComplete(false); setMode(nextMode); setSeconds((nextMode === "focus" ? minutes : 5) * 60) }
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 text-center shadow-soft sm:p-10">
      <div className="mb-8 flex justify-center gap-2">{[25, 45, 60].map(minutes => <Button key={minutes} size="sm" variant={duration === minutes ? "subtle" : "ghost"} disabled={running} aria-pressed={duration === minutes} onClick={() => { setDuration(minutes); reset("focus", minutes) }}>{minutes} min</Button>)}</div>
      <span className="rounded-full bg-pulse-soft px-3 py-1.5 text-xs font-semibold text-pulse-dark">{mode === "focus" ? "Focus time" : "Short break"}</span>
      <p role="timer" aria-label="Time remaining" className="my-8 font-display text-[64px] font-extrabold leading-none tracking-tight text-ink tabular-nums sm:text-[88px]">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
      {complete && <p role="status" className="mb-5 text-sm text-pulse-dark">{mode === "focus" ? "Focus interval complete. Take a short break." : "Break complete. Ready for another focus interval?"}</p>}
      <div className="flex justify-center gap-2"><Button variant="accent" disabled={complete} onClick={() => { if (running) setSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))); else deadline.current = Date.now() + seconds * 1000; setRunning(value => !value) }}>{running ? <Pause className="size-4" /> : <Play className="size-4" />}{running ? "Pause" : "Start"}</Button><Button variant="outline" onClick={() => reset()} aria-label="Reset timer"><RotateCcw className="size-4" /></Button></div>
      <Button variant="ghost" size="sm" className="mt-5" onClick={() => reset(mode === "focus" ? "break" : "focus")}>{mode === "focus" ? "Take a 5-minute break" : "Back to focus"}</Button>
    </section>
  )
}
