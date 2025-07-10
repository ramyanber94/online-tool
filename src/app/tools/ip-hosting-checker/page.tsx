import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import IpHostingCheckerClient from './ip-hosting-checker-client'

export const metadata: Metadata = createMetadata({
  title: 'IP Hosting Checker - Check Where an IP is Hosted',
  description: 'Free online IP hosting checker. Find out where an IP address is hosted with real-time results.',
  path: '/tools/ip-hosting-checker',
  keywords: [
    'ip hosting checker',
    'ip address lookup',
    'ip geolocation',
    'ip location',
    'ip info',
    'ip details',
    'ip whois',
    'ip checker'
  ]
})

export default function IpHostingCheckerPage() {
  return <IpHostingCheckerClient />
}
