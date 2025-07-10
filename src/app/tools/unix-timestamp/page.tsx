import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import UnixTimestampClient from './unix-timestamp-client'

export const metadata: Metadata = createMetadata({
  title: 'Unix Timestamp Converter - Convert Timestamps Online',
  description: 'Free Unix timestamp converter. Convert between Unix timestamps and human-readable dates. Support for milliseconds, current time, and various date formats.',
  path: '/tools/unix-timestamp',
  keywords: [
    'unix timestamp',
    'timestamp converter',
    'epoch converter',
    'unix time',
    'timestamp to date',
    'date to timestamp',
    'epoch time',
    'unix timestamp converter',
    'timestamp calculator'
  ]
})

export default function UnixTimestampPage() {
  return <UnixTimestampClient />
}
