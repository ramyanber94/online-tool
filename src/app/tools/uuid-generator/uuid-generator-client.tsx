"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shuffle, Copy, Download, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateUUIDs = async () => {
    setLoading(true)
    try {
      // Generate UUIDs client-side for better privacy
      const newUuids = Array.from({ length: count }, () => {
        return crypto.randomUUID()
      })
      setUuids(newUuids)
    } catch (error) {
      console.error("Failed to generate UUIDs:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllToClipboard = async () => {
    const allUuids = uuids.join('\n')
    await navigator.clipboard.writeText(allUuids)
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadUUIDs = () => {
    const blob = new Blob([uuids.join('\n')], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "uuids.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2.5">
              <Shuffle className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                UUID Generator
              </h1>
              <p className="text-muted-foreground">
                Generate unique identifiers for your applications
              </p>
            </div>
          </div>
        </div>
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Generate UUIDs</CardTitle>
              <CardDescription>
                Generate cryptographically secure UUID v4 identifiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="count" className="block text-sm font-medium mb-2">
                    Number of UUIDs
                  </label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={generateUUIDs}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shuffle className="w-4 h-4" />
                  )}
                  <span>{loading ? "Generating..." : "Generate"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {uuids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated UUIDs</CardTitle>
                    <CardDescription>
                      {uuids.length} UUID{uuids.length > 1 ? 's' : ''} generated
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllToClipboard}
                      className="flex items-center space-x-2"
                    >
                      {copiedIndex === -1 ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copiedIndex === -1 ? "Copied!" : "Copy All"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadUUIDs}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {uuids.map((uuid, index) => (
                    <div
                      key={`${uuid}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <code className="font-mono text-sm flex-1 mr-4 break-all">
                        {uuid}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(uuid, index)}
                        className="flex items-center space-x-2 shrink-0"
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

        {/* Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>About UUIDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What is a UUID?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    A Universally Unique Identifier (UUID) is a 128-bit identifier that is unique across both space and time. 
                    UUIDs are commonly used in distributed systems to identify information without significant central coordination.
                  </p>
                  <h3 className="font-semibold mb-2">UUID v4 Format</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Version 4 UUIDs are randomly generated and have the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx, 
                    where x is any hexadecimal digit and y is one of 8, 9, A, or B.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Common Use Cases</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Database primary keys</li>
                    <li>• API request identifiers</li>
                    <li>• Session tokens</li>
                    <li>• File names for uploads</li>
                    <li>• Transaction IDs</li>
                    <li>• Component keys in React</li>
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
