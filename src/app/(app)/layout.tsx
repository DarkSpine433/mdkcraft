import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AnalyticsProvider } from '@/providers/AnalyticsProvider'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  const ogImage = siteSettings.ogImage as Media | undefined

  return {
    description: siteSettings.description || 'Modern Web Development Services',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    openGraph: {
      description: siteSettings.description || 'Modern Web Development Services',
      images: ogImage?.url
        ? [
            {
              url: ogImage.url,
            },
          ]
        : undefined,
      siteName: siteSettings.siteName || 'MDKcraft',
      title: siteSettings.siteName || 'MDKcraft',
      type: 'website',
    },
    robots: {
      follow: true,
      index: true,
    },
    title: {
      default: siteSettings.siteName || 'MDKcraft',
      template: `%s | ${siteSettings.siteName || 'MDKcraft'}`,
    },
    twitter: {
      card: 'summary_large_image',
      description: siteSettings.description || 'Modern Web Development Services',
      images: ogImage?.url ? [ogImage.url] : undefined,
      title: siteSettings.siteName || 'MDKcraft',
    },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="pl"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <AnalyticsProvider enabled={true}>{children}</AnalyticsProvider>
      </body>
    </html>
  )
}
