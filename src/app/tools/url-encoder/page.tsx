import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import UrlEncoderClient from './url-encoder-client'

export const metadata: Metadata = createMetadata({
  title: 'URL Encoder/Decoder - Encode & Decode URLs Online',
  description: 'Free URL encoder and decoder tool. Encode and decode URLs, query parameters, and special characters. Switch between encoding and decoding modes with examples.',
  path: '/tools/url-encoder',
  keywords: [
    'URL encoder',
    'URL decoder',
    'percent encoding',
    'URL escape',
    'query parameter encoder',
    'URI encoder',
    'URL encoding online',
    'decode URL',
    'encode URL'
  ]
})

export default function UrlEncoderPage() {
  return <UrlEncoderClient />
}
