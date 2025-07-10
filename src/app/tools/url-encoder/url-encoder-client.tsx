"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Link, Copy, Check, ArrowUpDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"

export default function UrlEncoderClient() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const processUrl = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      let result = ""
      if (mode === "encode") {
        result = encodeURIComponent(input)
      } else {
        result = decodeURIComponent(input)
      }
      setOutput(result)
      setError("")
    } catch (err) {
      setError(`Failed to ${mode} URL: ${(err as Error).message}`)
      setOutput("")
    }
  }, [input, mode])

  const copyToClipboard = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const switchMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)
    
    // If there's output, use it as new input
    if (output) {
      setInput(output)
      setOutput("")
    }
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  // Process automatically when input or mode changes
  useEffect(() => {
    processUrl()
  }, [input, mode, processUrl])

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-2.5">
              <Link className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                URL Encoder/Decoder
              </h1>
              <p className="text-muted-foreground">
                Encode and decode URLs and URI components safely
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Input {mode === "encode" ? "URL" : "Encoded URL"}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={switchMode}
                      className="flex items-center gap-2"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      {mode === "encode" ? "Switch to Decode" : "Switch to Encode"}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {mode === "encode" 
                    ? "Enter a URL or text to encode for safe URL transmission"
                    : "Enter an encoded URL to decode back to readable format"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={mode === "encode" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("encode")}
                  >
                    Encode
                  </Button>
                  <Button
                    variant={mode === "decode" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("decode")}
                  >
                    Decode
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                  >
                    Clear
                  </Button>
                </div>
                <Textarea
                  placeholder={mode === "encode" 
                    ? "Enter URL or text to encode (e.g., https://example.com/search?q=hello world)"
                    : "Enter encoded URL to decode (e.g., https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world)"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                {error && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{mode === "encode" ? "Encoded" : "Decoded"} Result</span>
                  {output && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {mode === "encode" ? "URL-safe encoded result" : "Human-readable decoded result"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={output}
                  placeholder={`${mode === "encode" ? "Encoded" : "Decoded"} result will appear here...`}
                  className="min-h-[200px] font-mono text-sm bg-muted"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Examples Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Common Examples</CardTitle>
              <CardDescription>
                Click any example to try it out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">URLs with Special Characters</h3>
                  <div className="space-y-2">
                    {[
                      "https://example.com/search?q=hello world",
                      "https://api.site.com/users?name=John Doe&age=25",
                      "mailto:user@example.com?subject=Hello & Welcome!",
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(example)
                          setMode("encode")
                        }}
                        className="block w-full text-left p-2 text-xs font-mono bg-muted hover:bg-accent rounded transition-colors cursor-pointer"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Encoded Examples</h3>
                  <div className="space-y-2">
                    {[
                      "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world",
                      "name%3DJohn%20Doe%26age%3D25",
                      "Hello%20World%21%20%40%23%24%25",
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(example)
                          setMode("decode")
                        }}
                        className="block w-full text-left p-2 text-xs font-mono bg-muted hover:bg-accent rounded transition-colors cursor-pointer"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>About URL Encoding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What is URL Encoding?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    URL encoding (also called percent encoding) converts characters into a format 
                    that can be transmitted over the Internet. Special characters are replaced 
                    with a percent sign followed by two hexadecimal digits.
                  </p>
                  <h3 className="font-semibold mb-2">Common Characters</h3>
                  <div className="text-xs font-mono space-y-1">
                    <div>Space → %20</div>
                    <div>! → %21</div>
                    <div>@ → %40</div>
                    <div># → %23</div>
                    <div>& → %26</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">When to Use</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Passing data in URL parameters</li>
                    <li>• Handling special characters in URLs</li>
                    <li>• API query strings</li>
                    <li>• Form data transmission</li>
                    <li>• File names with spaces</li>
                    <li>• Email subjects and bodies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </ToolLayout>
  )
}
