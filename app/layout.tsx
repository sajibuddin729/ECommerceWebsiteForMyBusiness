import React from "react"
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'FusionBytePro - Your Premium Global Marketplace',
    template: '%s | FusionBytePro'
  },
  description: 'Discover premium apparel, cutting-edge electronics, digital assets, and innovative solutions from top creators worldwide. FusionBytePro offers a curated selection of high-quality products.',
  keywords: [
    'online marketplace',
    'premium products',
    'apparel and shoes',
    'electronics',
    'digital products',
    'software marketplace',
    'FusionBytePro',
    'global shopping',
    'innovative gear',
    'tech marketplace'
  ],
  authors: [{ name: 'FusionBytePro' }],
  creator: 'FusionBytePro',
  publisher: 'FusionBytePro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'FusionBytePro - Premium Digital Marketplace',
    description: 'Elevate your digital experience with premium products and innovative solutions.',
    siteName: 'FusionBytePro',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'FusionBytePro - Digital Marketplace',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FusionBytePro - Premium Digital Marketplace',
    description: 'Elevate your digital experience with premium products.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import { AppearanceProvider } from "@/components/AppearanceProvider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <AppearanceProvider>
          {children}
        </AppearanceProvider>
      </body>
    </html>
  )
}
