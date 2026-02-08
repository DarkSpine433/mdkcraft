import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'

import { Footer } from '@/components/Footer'
import { VisualEngine } from '@/components/Visual/VisualEngine'
import BrandFooter from '@/components/landingpage/BrandFooter'


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://twoja-strona.pl'),
  title: {
    default: 'MDKCraft | Modern Dev Agency | Production Ready',
    template: '%s | MDKCraft | Modern Dev Agency | Production Ready',
  },
  description: 'Niezrównane projekty stron internetowych z najnowszymi animacjami 2025.',
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/',
    siteName: 'MDKCraft',
  images: [
    {
      url: '/logo.svg',
      width: 1200,
      height: 630,
      alt: 'MDKCraft | Modern Dev Agency | Production Ready',
    },
  ],
  },
  
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default async function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Silnik Wizualny: Obsługuje interakcje, SVG i animacje tła */}
      <VisualEngine />

      <AdminBar />
 

      {children}
      <BrandFooter />

      <Footer />
    </>
  )
}
