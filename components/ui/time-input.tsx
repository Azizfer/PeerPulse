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
      onChange(`${hour}:${minute} ${period}`)
    }
  }, [hour, minute, period])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "")
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
    let val = e.target.value.replace(/\D/g, "")
    if (val) {
      const num = parseInt(val)
      if (num >= 0 && num <= 59) {
        setMinute(val.padStart(2, "0"))
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
        maxLength={2}
        className="w-16 h-full rounded-xl border-2 border-gray-300 bg-white px-3 text-center text-base font-medium text-gray-900 focus:outline-none focus:border-gray-500 transition-all duration-200 hover:border-gray-400"
      />
      
      <span className="flex items-center text-xl font-semibold text-gray-400">:</span>
      
      {/* Minute Input */}
      <input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        placeholder="00"
        maxLength={2}
        className="w-16 h-full rounded-xl border-2 border-gray-300 bg-white px-3 text-center text-base font-medium text-gray-900 focus:outline-none focus:border-gray-500 transition-all duration-200 hover:border-gray-400"
      />
      
      {/* AM/PM Toggle */}
      <div className="flex rounded-xl border-2 border-gray-300 overflow-hidden h-full">
        <button
          type="button"
          onClick={() => setPeriod("AM")}
          className={`px-4 text-sm font-semibold transition-colors ${
            period === "AM"
              ? "bg-[#2a2622] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => setPeriod("PM")}
          className={`px-4 text-sm font-semibold transition-colors ${
            period === "PM"
              ? "bg-[#2a2622] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  )
}
