import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StackToolkit - Essential Tools for Developers",
    template: "%s | StackToolkit"
  },
  description: "A comprehensive collection of developer tools for JSON formatting, URL encoding, UUID generation, color palettes, hash generation, password creation, barcode generation, image conversion, regex testing, and more. Built with Next.js and TypeScript. All tools work offline and respect your privacy.",
  keywords: [
    "developer tools", "JSON formatter", "UUID generator", "URL encoder", "URL decoder",
    "color palette generator", "hash generator", "SHA-256", "SHA-1", "MD5", 
    "base64 encoder", "base64 decoder", "password generator", "barcode generator",
    "QR code generator", "image converter", "image compressor", "unix timestamp",
    "regex tester", "regular expression", "IP checker", "hosting checker",
    "web development tools", "programming tools", "frontend tools", "backend tools"
  ],
  authors: [{ name: "StackToolkit", url: "https://stacktoolkit.dev" }],
  creator: "StackToolkit",
  publisher: "StackToolkit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://stacktoolkit.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stacktoolkit.dev",
    title: "StackToolkit - Essential Tools for Developers",
    description: "A comprehensive collection of developer tools for JSON formatting, URL encoding, UUID generation, color palettes, hash generation, and more. All tools work offline and respect your privacy.",
    siteName: "StackToolkit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StackToolkit - Essential Tools for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackToolkit - Essential Tools for Developers",
    description: "A comprehensive collection of developer tools for JSON formatting, URL encoding, UUID generation, color palettes, hash generation, and more. All tools work offline and respect your privacy.",
    creator: "@stacktoolkit",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "Developer Tools",
  other: {
    "google-site-verification": "YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
