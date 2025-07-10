import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import ImageConverterClient from './image-converter-client'

export const metadata: Metadata = createMetadata({
  title: 'Image Converter - Convert & Compress Images Online',
  description: 'Free image converter and compressor. Convert between PNG, JPG, WEBP, and other formats. Batch processing, quality control, and instant download. Privacy-first tool.',
  path: '/tools/image-converter',
  keywords: [
    'image converter',
    'image compressor',
    'PNG to JPG',
    'JPG to PNG',
    'WEBP converter',
    'image format converter',
    'batch image converter',
    'compress images',
    'image optimization'
  ]
})

export default function ImageConverterPage() {
  return <ImageConverterClient />
}
