"use client"

import Link from "next/link"
import { ArrowLeft, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface ToolLayoutProps {
  children: React.ReactNode
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Tools</span>
                </Button>
              </Link>
              
              {/* Separator */}
              <div className="h-6 w-px bg-border/50"></div>
              
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Code2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">StackToolkit</span>
              </Link>
            </div>

            {/* Right side - Theme toggle */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
