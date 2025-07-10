"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Hash, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"

// Simple hash functions using Web Crypto API

const generateSHA1 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const generateSHA256 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const generateSHA512 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

interface HashResult {
  algorithm: string
  hash: string
}

export default function HashGeneratorClient() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<HashResult[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateHashes = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const hashes = await Promise.all([
        generateSHA1(input).then(hash => ({ algorithm: 'SHA-1', hash })),
        generateSHA256(input).then(hash => ({ algorithm: 'SHA-256', hash })),
        generateSHA512(input).then(hash => ({ algorithm: 'SHA-512', hash })),
      ])
      
      setResults(hashes)
    } catch (error) {
      console.error('Error generating hashes:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (hash: string, index: number) => {
    await navigator.clipboard.writeText(hash)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2.5">
              <Hash className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Hash Generator
              </h1>
              <p className="text-muted-foreground">
                Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text
              </p>
            </div>
          </div>
        </div>
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Enter the text you want to hash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
              <Button 
                onClick={generateHashes} 
                disabled={!input.trim() || loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Hash className="w-4 h-4 mr-2 animate-spin" />
                    Generating Hashes...
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-2" />
                    Generate Hashes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Hash Results</CardTitle>
                <CardDescription>
                  Generated hashes for your input text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={result.algorithm}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div className="flex-1 mr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {result.algorithm}
                          </span>
                        </div>
                        <code className="text-xs sm:text-sm font-mono break-all text-slate-600 dark:text-slate-400">
                          {result.hash}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.hash, index)}
                        className="mt-2 sm:mt-0 self-end sm:self-center"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>About Hash Functions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    What are Hash Functions?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Hash functions are mathematical algorithms that convert input data of any size 
                    into a fixed-size string of characters. They&apos;re widely used in cryptography, 
                    data integrity verification, and password storage.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Common Use Cases</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Password verification</li>
                    <li>• File integrity checking</li>
                    <li>• Digital signatures</li>
                    <li>• Blockchain and cryptocurrencies</li>
                    <li>• Data deduplication</li>
                    <li>• Checksums for downloads</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                      Security Note
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      While SHA-1 is included for compatibility, it&apos;s considered cryptographically weak. 
                      Use SHA-256 or SHA-512 for security-critical applications.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </ToolLayout>
  )
}
