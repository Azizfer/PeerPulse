"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useCallback, useEffect, useId, useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

/**
 * Light / dark switch.
 *
 * The component owns its own `dark` state and seeds it from the DOM (which is
 * what next-themes has already applied on load). It deliberately does NOT read
 * `resolvedTheme` — if that value doesn't propagate, the switch stays stuck at
 * `checked=false` and every click reports "turn dark on", so toggling only
 * appears to work once.
 *
 * next-themes still handles persistence and the no-flash script; we also flip
 * the class and `color-scheme` directly so the change is immediate.
 */
export function ModeToggle({ className }: { className?: string }) {
  const id = useId()
  const { setTheme } = useTheme()
  const [dark, setDark] = useState<boolean | null>(null)

  // Seed from what next-themes applied before hydration.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  const apply = useCallback(
    (next: boolean) => {
      setDark(next)
      setTheme(next ? "dark" : "light")
      const root = document.documentElement
      root.classList.toggle("dark", next)
      root.style.colorScheme = next ? "dark" : "light"
    },
    [setTheme],
  )

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Switch
        id={id}
        checked={dark ?? false}
        onCheckedChange={apply}
        aria-label="Toggle dark mode"
      />
      <Label
        htmlFor={id}
        className="cursor-pointer text-muted-foreground"
        title={dark ? "Dark mode" : "Light mode"}
      >
        {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Label>
    </div>
  )
}
