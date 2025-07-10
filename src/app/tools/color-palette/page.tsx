import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import ColorPaletteClient from './color-palette-client'

export const metadata: Metadata = createMetadata({
  title: 'Color Palette Generator - Create Beautiful Color Schemes',
  description: 'Free color palette generator tool. Generate complementary, triadic, analogous, and monochromatic color schemes. Export palettes and copy hex codes. Perfect for designers.',
  path: '/tools/color-palette',
  keywords: [
    'color palette generator',
    'color scheme generator',
    'complementary colors',
    'triadic colors',
    'analogous colors',
    'monochromatic colors',
    'hex color generator',
    'color wheel',
    'design colors'
  ]
})

export default function ColorPalettePage() {
  return <ColorPaletteClient />
}
