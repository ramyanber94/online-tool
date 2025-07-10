import type { Metadata } from 'next'
import { createMetadata, siteConfig } from '@/lib/metadata'
import { HomePage } from '@/components/pages/home-page'

export const metadata: Metadata = createMetadata({
  title: 'Free Developer Tools - Privacy-First Online Utilities',
  description: siteConfig.description,
  path: '',
  keywords: [
    'free developer tools',
    'online utilities',
    'web developer tools',
    'JSON formatter online',
    'UUID generator free',
    'hash generator online',
    'developer productivity',
    'coding tools',
    'programming utilities'
  ]
})

export default function Page() {
  return <HomePage />
}
