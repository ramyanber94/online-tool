import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import JsonFormatterClient from './json-formatter-client'

export const metadata: Metadata = createMetadata({
  title: 'JSON Formatter - Format, Validate & Beautify JSON Online',
  description: 'Free online JSON formatter and validator. Format, minify, and beautify JSON data with syntax highlighting. Privacy-first tool that works offline in your browser.',
  path: '/tools/json-formatter',
  keywords: [
    'JSON formatter',
    'JSON validator',
    'JSON beautifier',
    'JSON minifier',
    'format JSON online',
    'validate JSON',
    'JSON syntax checker',
    'JSON pretty print',
    'JSON lint'
  ]
})

export default function JsonFormatterPage() {
  return <JsonFormatterClient />
}
