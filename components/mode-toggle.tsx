"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useId, useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

/**
 * Light / dark switch.
 *
 * next-themes persists the choice and applies `class="dark"` to <html>, but we
 * also toggle the class (and `color-scheme`) directly so the switch works even
 * if the provider is slow to hydrate. The switch itself is server-rendered so
 * there is no layout shift; only its `checked` state waits for mount.
 */
export function ModeToggle({ className }: { className?: string }) {
  const id = useId()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  const apply = (next: boolean) => {
    setTheme(next ? "dark" : "light")
    const root = document.documentElement
    root.classList.toggle("dark", next)
    root.style.colorScheme = next ? "dark" : "light"
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Switch
        id={id}
        checked={isDark}
        onCheckedChange={apply}
        aria-label="Toggle dark mode"
      />
      <Label
        htmlFor={id}
        className="cursor-pointer text-muted-foreground"
        title={isDark ? "Dark mode" : "Light mode"}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Label>
    </div>
  )
}
