import type { Metadata } from 'next'

export const siteConfig = {
    name: 'StackToolkit',
    url: 'https://stacktoolkit.dev',
    ogImage: 'https://stacktoolkit.dev/og.jpg',
    description: 'Free, privacy-first developer tools. Format JSON, generate UUIDs, create hashes, encode URLs, and more. All tools run in your browser - no data leaves your device.',
    keywords: [
        'developer tools',
        'JSON formatter',
        'UUID generator',
        'URL encoder',
        'color palette generator',
        'hash generator',
        'base64 encoder',
        'password generator',
        'barcode generator',
        'image converter',
        'unix timestamp',
        'regex tester',
        'IP checker',
        'web development',
        'programming tools',
        'frontend tools',
        'backend tools',
        'developer utilities',
        'online tools',
        'free tools',
        'privacy-first',
        'offline tools'
    ]
}

export const baseMetadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    referrer: 'origin-when-cross-origin',
    keywords: siteConfig.keywords,
    authors: [
        { name: siteConfig.name, url: siteConfig.url }
    ],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    verification: {
        google: 'YOUR_GOOGLE_VERIFICATION_CODE',
        yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
        yahoo: 'YOUR_YAHOO_VERIFICATION_CODE',
    },
}

interface CreateMetadataProps {
    title: string
    description: string
    path: string
    keywords?: string[]
    noIndex?: boolean
}

export function createMetadata({
    title,
    description,
    path,
    keywords = [],
    noIndex = false
}: CreateMetadataProps): Metadata {
    const fullTitle = `${title} | ${siteConfig.name}`
    const url = `${siteConfig.url}${path}`

    return {
        ...baseMetadata,
        title: fullTitle,
        description,
        keywords: [...siteConfig.keywords, ...keywords],
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: 'website',
            siteName: siteConfig.name,
            title: fullTitle,
            description,
            url,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${title} - ${siteConfig.name}`,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [siteConfig.ogImage],
            creator: '@stacktoolkit',
        },
        alternates: {
            canonical: url,
        },
    }
}
