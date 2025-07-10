"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X, Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const COOKIE_CONSENT_KEY = "stacktoolkit-cookie-consent"

interface CookieConsentProps {
  onAccept?: () => void
  onDecline?: () => void
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setShowBanner(false)
    onAccept?.()
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setShowBanner(false)
    onDecline?.()
  }

  const handleEssentialOnly = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "essential")
    setShowBanner(false)
    onDecline?.() // Treat as decline for analytics
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto md:left-auto md:max-w-lg"
        >
          <Card className="border-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Privacy & Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We use essential cookies to ensure our tools work properly. 
                    All data processing happens locally in your browser - we don&apos;t collect or store your personal information.
                  </p>
                  
                  {!showDetails ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleAccept}
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept All</span>
                      </Button>
                      <Button
                        onClick={handleEssentialOnly}
                        variant="outline"
                        size="sm"
                      >
                        Essential Only
                      </Button>
                      <Button
                        onClick={() => setShowDetails(!showDetails)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Customize</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Essential Cookies</span>
                          <span className="text-xs text-green-600 dark:text-green-400">Always Active</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Required for the website to function properly. These cannot be disabled.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Analytics Cookies</span>
                          <span className="text-xs text-muted-foreground">Optional</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Help us understand how our tools are used (anonymous usage statistics).
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          onClick={handleAccept}
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept All</span>
                        </Button>
                        <Button
                          onClick={handleEssentialOnly}
                          variant="outline"
                          size="sm"
                        >
                          Essential Only
                        </Button>
                        <Button
                          onClick={() => setShowDetails(false)}
                          variant="ghost"
                          size="sm"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleDecline}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
