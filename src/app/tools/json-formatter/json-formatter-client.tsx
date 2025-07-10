"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Copy, Download, Upload, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"

export default function JsonFormatterClient() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError("")
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message)
      setOutput("")
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError("")
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message)
      setOutput("")
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJson = () => {
    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInput(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5">
              <FileText className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                JSON Formatter
              </h1>
              <p className="text-muted-foreground">
                Format, validate, and beautify JSON data
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
                <CardTitle className="flex items-center space-x-2">
                  <span>Input JSON</span>
                </CardTitle>
                <CardDescription>
                  Paste your JSON data here or upload a file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={formatJson} variant="default">
                    Format
                  </Button>
                  <Button onClick={minifyJson} variant="outline">
                    Minify
                  </Button>
                  <Button variant="outline" className="relative">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      accept=".json"
                      onChange={loadFile}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste your JSON here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
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
                  <span>Formatted JSON</span>
                  {output && (
                    <div className="flex space-x-2">
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadJson}
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Formatted and validated JSON output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={output}
                  placeholder="Formatted JSON will appear here..."
                  className="min-h-[400px] font-mono text-sm bg-slate-50 dark:bg-slate-900"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Format & Validate</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Beautify JSON with proper indentation and validate syntax
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Copy className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Copy</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    One-click copy to clipboard for quick use
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">File Support</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upload and download JSON files directly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </ToolLayout>
  )
}
