import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import PasswordGeneratorClient from './password-generator-client'

export const metadata: Metadata = createMetadata({
  title: 'Password Generator - Create Secure Passwords Online',
  description: 'Free secure password generator. Create strong passwords with custom options including length, uppercase, lowercase, numbers, and symbols. Batch generation and strength meter included.',
  path: '/tools/password-generator',
  keywords: [
    'password generator',
    'secure password',
    'strong password',
    'random password',
    'password creator',
    'password maker',
    'secure password generator',
    'password strength',
    'password security'
  ]
})

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />
}
