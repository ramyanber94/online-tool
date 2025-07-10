"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToolLayoutProps {
  children: React.ReactNode
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-light">
      <nav className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tools</span>
            </Button>
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
