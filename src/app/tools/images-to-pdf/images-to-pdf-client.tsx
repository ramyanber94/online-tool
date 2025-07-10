"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  FileImage, 
  Upload, 
  Download, 
  X, 
  Loader2,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolLayout } from "@/components/tool-layout"
import { jsPDF } from "jspdf"

interface ImageFile {
  file: File
  id: string
  preview: string
  name: string
}

export default function ImagesToPdfClient() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isConverting, setIsConverting] = useState(false)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )

    const newImages: ImageFile[] = validFiles.map(file => ({
      file,
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      name: file.name
    }))

    setImages(prev => [...prev, ...newImages])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      // Clean up preview URL
      const removed = prev.find(img => img.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [moved] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, moved)
      return newImages
    })
  }

  const moveImageUp = (index: number) => {
    if (index > 0) {
      moveImage(index, index - 1)
    }
  }

  const moveImageDown = (index: number) => {
    if (index < images.length - 1) {
      moveImage(index, index + 1)
    }
  }

  const convertToPdf = async () => {
    if (images.length === 0) return

    setIsConverting(true)
    try {
      const pdf = new jsPDF()
      let isFirstPage = true

      for (const imageFile of images) {
        const img = new Image()
        
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = imageFile.preview
        })

        if (!isFirstPage) {
          pdf.addPage()
        }
        isFirstPage = false

        // Calculate dimensions to fit the page while maintaining aspect ratio
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 20

        const maxWidth = pageWidth - (margin * 2)
        const maxHeight = pageHeight - (margin * 2)

        const imgAspectRatio = img.width / img.height
        const pageAspectRatio = maxWidth / maxHeight

        let width, height

        if (imgAspectRatio > pageAspectRatio) {
          // Image is wider than page ratio
          width = maxWidth
          height = maxWidth / imgAspectRatio
        } else {
          // Image is taller than page ratio
          height = maxHeight
          width = maxHeight * imgAspectRatio
        }

        // Center the image on the page
        const x = (pageWidth - width) / 2
        const y = (pageHeight - height) / 2

        pdf.addImage(img, 'JPEG', x, y, width, height)
      }

      // Save the PDF
      pdf.save('images-combined.pdf')
    } catch (error) {
      console.error('Error converting to PDF:', error)
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5">
              <FileImage className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Images to PDF Converter
              </h1>
              <p className="text-muted-foreground">
                Convert multiple images to a single PDF file
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                Drag and drop images or click to select files. Supports JPG, PNG, WEBP, and GIF formats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.multiple = true
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement
                    handleFileSelect(target.files)
                  }
                  input.click()
                }}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop images here or click to upload</p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, WEBP, and GIF files
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Images List */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Selected Images ({images.length})</CardTitle>
                    <CardDescription>
                      Reorder images as needed. They will appear in this order in the PDF.
                    </CardDescription>
                  </div>
                  <Button
                    onClick={convertToPdf}
                    disabled={isConverting || images.length === 0}
                    className="flex items-center space-x-2"
                  >
                    {isConverting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{isConverting ? "Converting..." : "Convert to PDF"}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg group"
                    >
                      <div className="flex flex-col space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="p-1 h-6 w-6"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImageDown(index)}
                          disabled={index === images.length - 1}
                          className="p-1 h-6 w-6"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-sm font-mono text-muted-foreground min-w-[2rem]">
                        {index + 1}
                      </div>
                      
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{image.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(image.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>About Images to PDF Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">How it works</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This tool converts multiple images into a single PDF document. Each image is automatically 
                    resized to fit the page while maintaining its original aspect ratio. Images are processed 
                    entirely in your browser for maximum privacy.
                  </p>
                  <h3 className="font-semibold mb-2">Supported Formats</h3>
                  <p className="text-sm text-muted-foreground">
                    JPG, JPEG, PNG, WEBP, GIF, and other common image formats are supported.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Drag and drop multiple images</li>
                    <li>• Reorder images before conversion</li>
                    <li>• Automatic image resizing and centering</li>
                    <li>• Preserves image aspect ratios</li>
                    <li>• Privacy-first: all processing done locally</li>
                    <li>• No file size limits</li>
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
