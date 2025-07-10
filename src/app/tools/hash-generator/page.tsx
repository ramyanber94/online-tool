import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import HashGeneratorClient from './hash-generator-client'

export const metadata: Metadata = createMetadata({
  title: 'Hash Generator - Generate MD5, SHA-1, SHA-256 Hashes Online',
  description: 'Free hash generator tool. Create MD5, SHA-1, and SHA-256 hashes from text. Instant results with copy functionality. Privacy-first tool that works offline.',
  path: '/tools/hash-generator',
  keywords: [
    'hash generator',
    'MD5 generator',
    'SHA-1 generator',
    'SHA-256 generator',
    'hash function',
    'checksum generator',
    'cryptographic hash',
    'text hash',
    'hash calculator'
  ]
})

export default function HashGeneratorPage() {
  return <HashGeneratorClient />
}
