import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import RegexTesterClient from './regex-tester-client'

export const metadata: Metadata = createMetadata({
  title: 'Regex Tester - Test Your Regular Expressions Online',
  description: 'Free online regex tester. Test and debug your regular expressions with real-time results.',
  path: '/tools/regex-tester',
  keywords: [
    'regex tester',
    'regular expressions',
    'regex debugger',
    'regex online tool',
    'test regex',
    'debug regex',
    'regex match',
    'regex replace',
    'regex find'
  ]
})

export default function RegexTesterPage() {
  return <RegexTesterClient />
}
