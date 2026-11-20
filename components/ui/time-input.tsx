"use client"

import { useState, useEffect } from "react"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimeInput({ value, onChange, className = "" }: TimeInputProps) {
  // Parse the value into hour, minute, and period
  const parseTime = (timeString: string) => {
    if (!timeString) return { hour: "", minute: "", period: "AM" }

    const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (match) {
      return {
        hour: match[1],
        minute: match[2],
        period: match[3].toUpperCase()
      }
    }
    return { hour: "", minute: "", period: "AM" }
  }

  const parsed = parseTime(value)
  const [hour, setHour] = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState<"AM" | "PM">(parsed.period as "AM" | "PM")

  // Update parent when any part changes
  useEffect(() => {
    if (hour && minute) {
      onChange(`${hour}:${minute.padStart(2, "0")} ${period}`)
    } else {
      onChange("")
    }
  }, [hour, minute, period, onChange])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val) {
      const num = parseInt(val)
      if (num >= 1 && num <= 12) {
        setHour(val)
      } else if (num === 0) {
        setHour("12")
      }
    } else {
      setHour("")
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val) {
      const num = parseInt(val)
      if (num >= 0 && num <= 59) {
        setMinute(val)
      }
    } else {
      setMinute("")
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Hour Input */}
      <input
        type="text"
        value={hour}
        onChange={handleHourChange}
        placeholder="12"
        aria-label="Start hour"
        inputMode="numeric"
        maxLength={2}
        className="h-full w-12 shrink-0 rounded-xl border border-line-strong bg-surface px-2 text-center text-[15px] font-medium text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10 sm:w-14"
      />

      <span className="flex items-center text-xl font-semibold text-ink-faint">:</span>

      {/* Minute Input */}
      <input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        placeholder="00"
        aria-label="Start minute"
        inputMode="numeric"
        maxLength={2}
        className="h-full w-12 shrink-0 rounded-xl border border-line-strong bg-surface px-2 text-center text-[15px] font-medium text-ink transition-all duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10 sm:w-14"
      />

      {/* AM/PM Toggle */}
      <div className="flex h-full overflow-hidden rounded-xl border border-line-strong bg-surface">
        <button
          type="button"
          onClick={() => setPeriod("AM")}
          aria-pressed={period === "AM"}
          className={`px-3 text-sm font-semibold transition-colors ${
            period === "AM"
              ? "bg-ink text-paper"
              : "bg-surface text-ink-soft hover:bg-surface-sunken"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => setPeriod("PM")}
          aria-pressed={period === "PM"}
          className={`px-3 text-sm font-semibold transition-colors ${
            period === "PM"
              ? "bg-ink text-paper"
              : "bg-surface text-ink-soft hover:bg-surface-sunken"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  )
}
