import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import BarcodeGeneratorClient from './barcode-generator-client'

export const metadata: Metadata = createMetadata({
  title: 'Barcode Generator - Create QR Codes & Barcodes Online',
  description: 'Free barcode and QR code generator. Create Code 128, Code 39, EAN-13, UPC-A, and QR codes. Generate barcodes for SKUs, GTINs, and custom data with download options.',
  path: '/tools/barcode-generator',
  keywords: [
    'barcode generator',
    'QR code generator',
    'Code 128',
    'Code 39',
    'EAN-13',
    'UPC-A',
    'SKU barcode',
    'GTIN barcode',
    'barcode creator'
  ]
})

export default function BarcodeGeneratorPage() {
  return <BarcodeGeneratorClient />
}
