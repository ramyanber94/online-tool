"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative w-10 h-10 rounded-full hover:bg-primary/10 transition-all duration-300"
      >
        <Sun className="h-4 w-4 text-amber-500" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-10 h-10 rounded-full hover:bg-primary/10 transition-all duration-300 group"
    >
      <div className="relative flex items-center justify-center">
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-all duration-300 group-hover:scale-110" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-45" />
        )}
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
