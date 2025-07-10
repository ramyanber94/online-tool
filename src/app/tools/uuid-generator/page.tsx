import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import UuidGeneratorClient from './uuid-generator-client'

export const metadata: Metadata = createMetadata({
  title: 'UUID Generator - Generate Unique Identifiers Online',
  description: 'Free UUID generator tool. Generate version 4 UUIDs (random) with one click. Copy, download, and get information about unique identifiers. Privacy-first and works offline.',
  path: '/tools/uuid-generator',
  keywords: [
    'UUID generator',
    'unique identifier generator',
    'GUID generator',
    'UUID v4',
    'random UUID',
    'unique ID generator',
    'identifier generator',
    'UUID online',
    'generate UUID'
  ]
})

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />
}
