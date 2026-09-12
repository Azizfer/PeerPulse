"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

/**
 * Light / dark switch.
 *
 * The switch itself is server-rendered (so there is no layout shift); only its
 * `checked` state waits for mount, because the stored theme is only known on the
 * client. First client render matches the server exactly, so there is no
 * hydration mismatch.
 */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Switch
        id="theme-mode"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <Label
        htmlFor="theme-mode"
        className="cursor-pointer text-muted-foreground"
        title={isDark ? "Dark mode" : "Light mode"}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Label>
    </div>
  )
}
