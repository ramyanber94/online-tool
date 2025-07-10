import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import ImagesToPdfClient from './images-to-pdf-client'

export const metadata: Metadata = createMetadata({
  title: 'Images to PDF Converter - Convert Multiple Images to PDF Online',
  description: 'Free online tool to convert multiple images to PDF. Supports JPG, PNG, WEBP, and GIF formats. Drag and drop images, reorder them, and download as a single PDF file. Privacy-first and works offline.',
  path: '/tools/images-to-pdf',
  keywords: [
    'images to PDF converter',
    'convert images to PDF',
    'multiple images to PDF',
    'JPG to PDF',
    'PNG to PDF',
    'image to PDF converter',
    'merge images to PDF',
    'combine images PDF',
    'photos to PDF',
    'pictures to PDF online'
  ]
})

export default function ImagesToPdfPage() {
  return <ImagesToPdfClient />
}
