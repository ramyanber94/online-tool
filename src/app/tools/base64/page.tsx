import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import Base64Client from './base64-client'

export const metadata: Metadata = createMetadata({
  title: 'Base64 Encoder/Decoder - Encode & Decode Base64 Online',
  description: 'Free Base64 encoder and decoder tool. Encode and decode text, files, and data to/from Base64 format. Upload files, download results, and copy with one click.',
  path: '/tools/base64',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 converter',
    'encode base64',
    'decode base64',
    'base64 online',
    'file to base64',
    'base64 to file',
    'data URI'
  ]
})

export default function Base64Page() {
  return <Base64Client />
}
