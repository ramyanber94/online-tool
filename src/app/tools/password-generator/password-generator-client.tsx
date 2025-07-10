"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToolLayout } from "@/components/tool-layout"
import { Lock, Copy, RefreshCw, Download, AlertCircle, Eye, EyeOff, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

interface GeneratedPassword {
  password: string
  strength: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong"
  entropy: number
}

export default function PasswordGeneratorPage() {
  const [passwords, setPasswords] = useState<GeneratedPassword[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  })
  const [passwordCount, setPasswordCount] = useState(1)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showPasswords, setShowPasswords] = useState(true)
  const [error, setError] = useState("")

  const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    similar: "il1Lo0O", // Characters that look similar
    ambiguous: "{}[]()/\\'\"`~,;.<>", // Characters that might be ambiguous
  }

  const calculateStrength = useCallback((password: string): { strength: GeneratedPassword["strength"]; entropy: number } => {
    let charset = 0
    if (/[a-z]/.test(password)) charset += 26
    if (/[A-Z]/.test(password)) charset += 26
    if (/[0-9]/.test(password)) charset += 10
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32

    const entropy = Math.log2(Math.pow(charset, password.length))
    
    let strength: GeneratedPassword["strength"]
    if (entropy < 28) strength = "Weak"
    else if (entropy < 36) strength = "Fair"
    else if (entropy < 60) strength = "Good"
    else if (entropy < 128) strength = "Strong"
    else strength = "Very Strong"

    return { strength, entropy: Math.round(entropy) }
  }, [])

  const generatePassword = useCallback((): string => {
    let charset = ""
    
    // Build charset based on options
    if (options.includeUppercase) charset += characterSets.uppercase
    if (options.includeLowercase) charset += characterSets.lowercase
    if (options.includeNumbers) charset += characterSets.numbers
    if (options.includeSymbols) charset += characterSets.symbols

    // Remove similar/ambiguous characters if requested
    if (options.excludeSimilar) {
      charset = charset.split("").filter(char => !characterSets.similar.includes(char)).join("")
    }
    if (options.excludeAmbiguous) {
      charset = charset.split("").filter(char => !characterSets.ambiguous.includes(char)).join("")
    }

    if (charset.length === 0) {
      throw new Error("No character set selected")
    }

    // Generate password
    let password = ""
    const array = new Uint32Array(options.length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length]
    }

    // Ensure at least one character from each selected set
    let finalPassword = password
    const requiredSets = []
    if (options.includeUppercase) requiredSets.push({ chars: characterSets.uppercase, name: "uppercase" })
    if (options.includeLowercase) requiredSets.push({ chars: characterSets.lowercase, name: "lowercase" })
    if (options.includeNumbers) requiredSets.push({ chars: characterSets.numbers, name: "numbers" })
    if (options.includeSymbols) requiredSets.push({ chars: characterSets.symbols, name: "symbols" })

    // Check if password contains at least one character from each required set
    for (const set of requiredSets) {
      let hasChar = false
      for (const char of set.chars) {
        if (finalPassword.includes(char) && (!options.excludeSimilar || !characterSets.similar.includes(char)) && (!options.excludeAmbiguous || !characterSets.ambiguous.includes(char))) {
          hasChar = true
          break
        }
      }
      if (!hasChar && finalPassword.length > 0) {
        // Replace a random character with one from this set
        const randomIndex = Math.floor(Math.random() * finalPassword.length)
        let validChars = set.chars
        if (options.excludeSimilar) {
          validChars = validChars.split("").filter(char => !characterSets.similar.includes(char)).join("")
        }
        if (options.excludeAmbiguous) {
          validChars = validChars.split("").filter(char => !characterSets.ambiguous.includes(char)).join("")
        }
        if (validChars.length > 0) {
          const randomChar = validChars[Math.floor(Math.random() * validChars.length)]
          finalPassword = finalPassword.substring(0, randomIndex) + randomChar + finalPassword.substring(randomIndex + 1)
        }
      }
    }

    return finalPassword
  }, [options])

  const generatePasswords = useCallback(() => {
    try {
      setError("")
      const newPasswords: GeneratedPassword[] = []
      
      for (let i = 0; i < passwordCount; i++) {
        const password = generatePassword()
        const { strength, entropy } = calculateStrength(password)
        newPasswords.push({ password, strength, entropy })
      }
      
      setPasswords(newPasswords)
    } catch (err) {
      setError((err as Error).message)
      setPasswords([])
    }
  }, [passwordCount, generatePassword, calculateStrength])

  const copyToClipboard = useCallback(async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  const downloadPasswords = useCallback(() => {
    if (passwords.length === 0) return
    
    const content = passwords.map((p, i) => 
      `Password ${i + 1}: ${p.password} (Strength: ${p.strength}, Entropy: ${p.entropy} bits)`
    ).join("\n")
    
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-passwords.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [passwords])

  const getStrengthColor = (strength: GeneratedPassword["strength"]) => {
    switch (strength) {
      case "Weak": return "text-red-500"
      case "Fair": return "text-orange-500"
      case "Good": return "text-yellow-500"
      case "Strong": return "text-green-500"
      case "Very Strong": return "text-emerald-500"
      default: return "text-muted-foreground"
    }
  }

  const getStrengthBars = (strength: GeneratedPassword["strength"]) => {
    const levels = ["Weak", "Fair", "Good", "Strong", "Very Strong"]
    const currentLevel = levels.indexOf(strength) + 1
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 w-4 rounded ${
              level <= currentLevel
                ? level <= 1 ? "bg-red-500"
                : level <= 2 ? "bg-orange-500"  
                : level <= 3 ? "bg-yellow-500"
                : level <= 4 ? "bg-green-500"
                : "bg-emerald-500"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-2.5">
              <Lock className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Password Generator
              </h1>
              <p className="text-muted-foreground">
                Generate secure passwords with custom options
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Password Options
              </CardTitle>
              <CardDescription>
                Customize your password generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Length</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="4"
                        max="128"
                        value={options.length}
                        onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) || 16 }))}
                        className="w-20"
                      />
                      <input
                        type="range"
                        min="4"
                        max="128"
                        value={options.length}
                        onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Passwords</label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={passwordCount}
                      onChange={(e) => setPasswordCount(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Character Sets</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.includeUppercase}
                          onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Uppercase (A-Z)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.includeLowercase}
                          onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Lowercase (a-z)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.includeNumbers}
                          onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Numbers (0-9)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.includeSymbols}
                          onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Symbols (!@#$%^&*)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Exclusions</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.excludeSimilar}
                          onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Exclude similar chars (il1Lo0O)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.excludeAmbiguous}
                          onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Exclude ambiguous chars ({}[]())</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button onClick={generatePasswords} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Generate Passwords
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-2"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPasswords ? "Hide" : "Show"} Passwords
                </Button>
                {passwords.length > 0 && (
                  <Button variant="outline" onClick={downloadPasswords}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Passwords */}
          {passwords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Passwords</CardTitle>
                <CardDescription>
                  Click any password to copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {passwords.map((passwordData, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <code className={`font-mono text-sm ${showPasswords ? "" : "blur-sm select-none"}`}>
                            {passwordData.password}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(passwordData.password, index)}
                            className="shrink-0"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedIndex === index ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <span>Strength:</span>
                            <span className={getStrengthColor(passwordData.strength)}>
                              {passwordData.strength}
                            </span>
                            {getStrengthBars(passwordData.strength)}
                          </div>
                          <div>
                            Entropy: {passwordData.entropy} bits
                          </div>
                          <div>
                            Length: {passwordData.password.length}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {passwords.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No passwords generated yet</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your options and click Generate Passwords to create secure passwords
                </p>
                <Button onClick={generatePasswords}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Your First Password
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Password Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use passwords with at least 12 characters</li>
                    <li>• Include uppercase, lowercase, numbers, and symbols</li>
                    <li>• Use unique passwords for each account</li>
                    <li>• Enable two-factor authentication when possible</li>
                    <li>• Use a password manager to store passwords</li>
                    <li>• Change passwords if they&apos;ve been compromised</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Strength Indicators</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-4 bg-red-500 rounded"></div>
                      <span><strong>Weak:</strong> &lt; 28 bits entropy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-4 bg-orange-500 rounded"></div>
                      <span><strong>Fair:</strong> 28-35 bits entropy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-4 bg-yellow-500 rounded"></div>
                      <span><strong>Good:</strong> 36-59 bits entropy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-4 bg-green-500 rounded"></div>
                      <span><strong>Strong:</strong> 60-127 bits entropy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-4 bg-emerald-500 rounded"></div>
                      <span><strong>Very Strong:</strong> 128+ bits entropy</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
