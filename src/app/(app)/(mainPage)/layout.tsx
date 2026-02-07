import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/components/Header'
import { InitTheme } from '@/providers/Theme/InitTheme'

import { Footer } from '@/components/Footer'
import { VisualEngine } from '@/components/Visual/VisualEngine'
import BrandFooter from '@/components/landingpage/BrandFooter'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://twoja-strona.pl'),
  title: {
    default: 'Modern Dev Agency | Production Ready',
    template: '%s | Modern Dev Agency',
  },
  description: 'Niezrównane projekty stron internetowych z najnowszymi animacjami 2025.',
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/',
    siteName: 'MDKCraft',
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pl"
      className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-black antialiased selection:bg-primary selection:text-white">
        {/* Silnik Wizualny: Obsługuje interakcje, SVG i animacje tła */}
        <VisualEngine />

        <AdminBar />
        <Header />

        <main className="w-full max-w-[100vw] ">{children}</main>
        <BrandFooter />

        <Footer />
      </body>
    </html>
  )
}
