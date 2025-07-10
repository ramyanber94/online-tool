"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToolLayout } from "@/components/tool-layout"
import { Palette, Copy, Shuffle, Download, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  name?: string
}

interface ColorPalette {
  id: string
  name: string
  colors: Color[]
  type: "monochromatic" | "analogous" | "complementary" | "triadic" | "tetradic" | "random"
}

export default function ColorPaletteClient() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [baseColor, setBaseColor] = useState("#3B82F6")
  const [paletteType, setPaletteType] = useState<ColorPalette["type"]>("analogous")
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  // Color utility functions
  const hexToRgb = useCallback((hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }, [])

  const rgbToHsl = useCallback((r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }, [])

  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2
    let r = 0
    let g = 0
    let b = 0

    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }, [])

  const createColor = useCallback((hex: string): Color => {
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return { hex, rgb, hsl }
  }, [hexToRgb, rgbToHsl])

  const generatePalette = useCallback(() => {
    const baseRgb = hexToRgb(baseColor)
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)
    const colors: Color[] = []

    switch (paletteType) {
      case "monochromatic":
        for (let i = 0; i < 5; i++) {
          const lightness = Math.max(10, Math.min(90, baseHsl.l + (i - 2) * 20))
          const hex = hslToHex(baseHsl.h, baseHsl.s, lightness)
          colors.push(createColor(hex))
        }
        break

      case "analogous":
        for (let i = 0; i < 5; i++) {
          const hue = (baseHsl.h + (i - 2) * 30 + 360) % 360
          const hex = hslToHex(hue, baseHsl.s, baseHsl.l)
          colors.push(createColor(hex))
        }
        break

      case "complementary":
        colors.push(createColor(baseColor))
        const compHue = (baseHsl.h + 180) % 360
        colors.push(createColor(hslToHex(compHue, baseHsl.s, baseHsl.l)))
        // Add variations
        colors.push(createColor(hslToHex(baseHsl.h, baseHsl.s, Math.max(10, baseHsl.l - 20))))
        colors.push(createColor(hslToHex(compHue, baseHsl.s, Math.max(10, baseHsl.l - 20))))
        colors.push(createColor(hslToHex(baseHsl.h, Math.max(10, baseHsl.s - 20), baseHsl.l)))
        break

      case "triadic":
        for (let i = 0; i < 3; i++) {
          const hue = (baseHsl.h + i * 120) % 360
          colors.push(createColor(hslToHex(hue, baseHsl.s, baseHsl.l)))
        }
        // Add lighter variations
        for (let i = 0; i < 2; i++) {
          const hue = (baseHsl.h + i * 120) % 360
          colors.push(createColor(hslToHex(hue, baseHsl.s, Math.min(90, baseHsl.l + 25))))
        }
        break

      case "tetradic":
        for (let i = 0; i < 4; i++) {
          const hue = (baseHsl.h + i * 90) % 360
          colors.push(createColor(hslToHex(hue, baseHsl.s, baseHsl.l)))
        }
        colors.push(createColor(hslToHex(baseHsl.h, Math.max(10, baseHsl.s - 30), baseHsl.l)))
        break

      case "random":
        colors.push(createColor(baseColor))
        for (let i = 0; i < 4; i++) {
          const hue = Math.floor(Math.random() * 360)
          const saturation = Math.floor(Math.random() * 50) + 50
          const lightness = Math.floor(Math.random() * 40) + 30
          colors.push(createColor(hslToHex(hue, saturation, lightness)))
        }
        break
    }

    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `${paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette`,
      colors: colors.slice(0, 5),
      type: paletteType,
    }

    setPalettes((prev) => [newPalette, ...prev.slice(0, 9)]) // Keep last 10 palettes
  }, [baseColor, paletteType, hexToRgb, rgbToHsl, hslToHex, createColor])

  const copyToClipboard = useCallback(async (text: string, colorId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedColor(colorId)
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  const exportPalette = useCallback((palette: ColorPalette) => {
    const paletteData = {
      name: palette.name,
      type: palette.type,
      colors: palette.colors.map((color) => ({
        hex: color.hex,
        rgb: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
        hsl: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
      })),
    }

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Color Palette Generator
          </h1>
          <p className="text-muted-foreground">
            Generate beautiful color palettes for your designs
          </p>
        </div>
        
        <div className="space-y-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Generate Palette
            </CardTitle>
            <CardDescription>
              Choose a base color and palette type to generate harmonious color combinations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Palette Type</label>
                <select
                  value={paletteType}
                  onChange={(e) => setPaletteType(e.target.value as ColorPalette["type"])}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                >
                  <option value="monochromatic">Monochromatic</option>
                  <option value="analogous">Analogous</option>
                  <option value="complementary">Complementary</option>
                  <option value="triadic">Triadic</option>
                  <option value="tetradic">Tetradic</option>
                  <option value="random">Random</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex gap-2">
                  <Button onClick={generatePalette} className="flex-1">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm border"
                >
                  <h4 className="font-medium mb-2">Palette Types:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><strong>Monochromatic:</strong> Uses different shades of the same color</li>
                    <li><strong>Analogous:</strong> Uses colors next to each other on the color wheel</li>
                    <li><strong>Complementary:</strong> Uses colors opposite on the color wheel</li>
                    <li><strong>Triadic:</strong> Uses three colors evenly spaced on the color wheel</li>
                    <li><strong>Tetradic:</strong> Uses four colors forming a rectangle on the color wheel</li>
                    <li><strong>Random:</strong> Generates random harmonious colors</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Generated Palettes */}
        <AnimatePresence>
          {palettes.map((palette) => (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{palette.name}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportPalette(palette)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {palette.colors.map((color, index) => (
                      <div key={index} className="space-y-3">
                        <div
                          className="w-full h-24 rounded-lg border cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyToClipboard(color.hex, `${palette.id}-${index}-hex`)}
                        />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">HEX</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => copyToClipboard(color.hex, `${palette.id}-${index}-hex`)}
                            >
                              {copiedColor === `${palette.id}-${index}-hex` ? (
                                <span className="text-xs text-green-500">Copied!</span>
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">
                            {color.hex}
                          </code>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">RGB</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => 
                                copyToClipboard(
                                  `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
                                  `${palette.id}-${index}-rgb`
                                )
                              }
                            >
                              {copiedColor === `${palette.id}-${index}-rgb` ? (
                                <span className="text-xs text-green-500">Copied!</span>
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">
                            {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                          </code>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">HSL</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => 
                                copyToClipboard(
                                  `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
                                  `${palette.id}-${index}-hsl`
                                )
                              }
                            >
                              {copiedColor === `${palette.id}-${index}-hsl` ? (
                                <span className="text-xs text-green-500">Copied!</span>
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">
                            {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {palettes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No palettes generated yet</h3>
              <p className="text-muted-foreground mb-4">
                Choose a base color and palette type, then click Generate to create your first palette
              </p>
              <Button onClick={generatePalette}>
                <Shuffle className="w-4 h-4 mr-2" />
                Generate Your First Palette
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      </div>
    </ToolLayout>
  )
}
