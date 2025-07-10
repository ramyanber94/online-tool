'use client'

interface StructuredDataProps {
  data: Record<string, unknown>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Common structured data schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StackToolkit",
  "url": "https://stacktoolkit.pro",
  "description": "Essential tools for developers. All tools work offline and respect your privacy.",
  "foundingDate": "2024",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StackToolkit",
  "url": "https://stacktoolkit.pro",
  "description": "Essential tools for developers. Format JSON, generate UUIDs, create hashes, and much more. All tools work offline and respect your privacy.",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "publisher": {
    "@type": "Organization",
    "name": "StackToolkit"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://stacktoolkit.pro/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})
