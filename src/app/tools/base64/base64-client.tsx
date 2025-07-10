"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ToolLayout } from "@/components/tool-layout"
import { Binary, Copy, ArrowUpDown, Download, Upload, AlertCircle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Base64Client() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copiedText, setCopiedText] = useState(false)
  const [error, setError] = useState("")
  const [showInfo, setShowInfo] = useState(false)

  const processBase64 = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      if (mode === "encode") {
        // Encode to Base64
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
        setError("")
      } else {
        // Decode from Base64
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
        setError("")
      }
    } catch (err) {
      setError(`Failed to ${mode}: ${(err as Error).message}`)
      setOutput("")
    }
  }, [input, mode])

  const copyToClipboard = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopiedText(true)
      setTimeout(() => setCopiedText(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [output])

  const downloadResult = useCallback(() => {
    if (!output) return
    
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `base64-${mode}-result.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [output, mode])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setInput(content)
      setMode("encode") // Automatically set to encode when uploading a file
    }
    reader.readAsText(file)
  }, [])

  const switchMode = useCallback(() => {
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)
    
    // If there's output, use it as new input
    if (output) {
      setInput(output)
      setOutput("")
    }
  }, [mode, output])

  const clearAll = useCallback(() => {
    setInput("")
    setOutput("")
    setError("")
  }, [])

  // Process automatically when input or mode changes
  useEffect(() => {
    processBase64()
  }, [input, mode, processBase64])

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 p-2.5">
              <Binary className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Base64 Encoder/Decoder
              </h1>
              <p className="text-muted-foreground">
                Encode and decode Base64 strings for data transmission
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Binary className="w-5 h-5" />
                Base64 {mode === "encode" ? "Encoder" : "Decoder"}
              </CardTitle>
              <CardDescription>
                {mode === "encode" 
                  ? "Convert text or data to Base64 format for safe transmission"
                  : "Decode Base64 strings back to readable text or data"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
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
                  variant="outline"
                  size="sm"
                  onClick={switchMode}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Switch
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm border"
                  >
                    <h4 className="font-medium mb-2">About Base64:</h4>
                    <p className="text-muted-foreground mb-2">
                      Base64 is a binary-to-text encoding scheme that represents binary data using ASCII characters. 
                      It&apos;s commonly used for encoding data in emails, URLs, and web applications.
                    </p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Uses characters A-Z, a-z, 0-9, +, /</li>
                      <li>• Padding with = characters when needed</li>
                      <li>• Increases data size by ~33%</li>
                      <li>• Safe for text-based protocols</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Input/Output Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Input {mode === "encode" ? "Text" : "Base64"}</span>
                  <div className="flex gap-2">
                    {mode === "encode" && (
                      <div>
                        <input
                          type="file"
                          accept=".txt,.json,.xml,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  {mode === "encode" 
                    ? "Enter text to encode or upload a text file"
                    : "Enter Base64 encoded string to decode"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={mode === "encode" 
                    ? "Enter text to encode to Base64..."
                    : "Enter Base64 string to decode..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                {error && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{mode === "encode" ? "Base64" : "Decoded"} Result</span>
                  {output && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copiedText ? "Copied!" : "Copy"}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadResult}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  {mode === "encode" ? "Base64 encoded result" : "Plain text decoded result"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={output}
                  placeholder={`${mode === "encode" ? "Base64" : "Decoded"} result will appear here...`}
                  className="min-h-[200px] font-mono text-sm bg-muted"
                />
                {output && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Length: {output.length} characters
                    {mode === "encode" && input && (
                      <span> | Size increase: {Math.round((output.length / input.length - 1) * 100)}%</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Examples Section */}
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
                  <h3 className="font-semibold mb-3">Text to Encode</h3>
                  <div className="space-y-2">
                    {[
                      "Hello, World!",
                      "Base64 encoding example",
                      '{"name": "John", "age": 30}',
                      "This is a longer text example that shows how Base64 encoding works with multiple lines.",
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(example)
                          setMode("encode")
                        }}
                        className="block w-full text-left p-2 text-xs bg-muted hover:bg-accent rounded transition-colors cursor-pointer"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Base64 to Decode</h3>
                  <div className="space-y-2">
                    {[
                      "SGVsbG8sIFdvcmxkIQ==",
                      "QmFzZTY0IGVuY29kaW5nIGV4YW1wbGU=",
                      "eyJuYW1lIjogIkpvaG4iLCAiYWdlIjogMzB9",
                      "VGhpcyBpcyBhIGxvbmdlciB0ZXh0IGV4YW1wbGU=",
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

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Base64 Encoding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Common Use Cases</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Email attachments (MIME)</li>
                    <li>• Data URLs for images</li>
                    <li>• API authentication tokens</li>
                    <li>• JSON Web Tokens (JWT)</li>
                    <li>• Binary data in XML/JSON</li>
                    <li>• URL-safe data transmission</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Character Set</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div><strong>A-Z:</strong> Values 0-25</div>
                    <div><strong>a-z:</strong> Values 26-51</div>
                    <div><strong>0-9:</strong> Values 52-61</div>
                    <div><strong>+:</strong> Value 62</div>
                    <div><strong>/:</strong> Value 63</div>
                    <div><strong>=:</strong> Padding character</div>
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
