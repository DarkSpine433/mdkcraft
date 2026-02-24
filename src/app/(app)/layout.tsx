import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import MaintenanceController from '@/components/MaintenanceController'
import OfflineBarStatus from '@/components/OfflineBarStatus'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Media } from '@/payload-types'
import { AnalyticsProvider } from '@/providers/AnalyticsProvider'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { default as configPromise } from '@payload-config'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { getPayload } from 'payload'
import './globals.css'

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
  // Parsowanie obiektu z ENV
  const payload = await getPayload({ config: configPromise })

  const result = await payload.findGlobal({
    slug: 'redirects', // required
    depth: 2,
    overrideAccess: false,
    showHiddenFields: true,
  })

  let maintenanceConfig = {
    maintenancePages: [],
    redirectTo: '/',
    redirectButtonText: 'Strona główna',
    maintenancePagesDescription:
      'Obecnie wprowadzamy nowe systemy i zabezpieczenia, aby Twoja gra była jeszcze bardziej płynna.',
  }

  if (process.env.MAINTENANCE_PAGES) {
    try {
      const parsed = JSON.parse(process.env.MAINTENANCE_PAGES)
      maintenanceConfig = {
        maintenancePages: parsed.maintenancePages || [],
        redirectTo: parsed.redirectTo || '/',
        redirectButtonText: parsed.redirectButtonText || 'Strona główna',
        maintenancePagesDescription: parsed.maintenancePagesDescription || '',
      }
    } catch (e) {
      console.error('Błąd parsowania MAINTENANCE_PAGES:', e)
    }
  }
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
        <TooltipProvider>
          <AnalyticsProvider enabled={true}>
            <MaintenanceController
              maintenancePaths={maintenanceConfig.maintenancePages}
              redirectTo={maintenanceConfig.redirectTo}
              redirectButtonText={maintenanceConfig.redirectButtonText}
              maintenancePagesDescription={maintenanceConfig.maintenancePagesDescription}
            >
              {children}
            </MaintenanceController>

            <OfflineBarStatus />
          </AnalyticsProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
