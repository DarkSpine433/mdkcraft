import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Notifications } from '@/collections/Notifications'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { Opinions } from '@/globals/Opinions'
import { ClientFiles } from './collections/ClientFiles'
import { ConfiguratorOptions } from './collections/ConfiguratorOptions'
import { FAQ } from './collections/FAQ'
import { Projects } from './collections/Projects'
import { Roadmap } from './collections/Roadmap'
import { Showcases } from './collections/Showcases'
import { SubscriptionAddons } from './collections/SubscriptionAddons'
import { SubscriptionPlans } from './collections/SubscriptionPlans'
import { Tickets } from './collections/Tickets'

// Analytics Collections
import { ContactInquiries } from '@/collections/ContactInquiries'
import { ConversionFunnels } from '@/collections/ConversionFunnels'
import { HeatmapData } from '@/collections/HeatmapData'
import { NewsletterSubscribers } from '@/collections/NewsletterSubscribers'
import { PageViews } from '@/collections/PageViews'
import { ProjectViews } from '@/collections/ProjectViews'
import { UserBehaviorEvents } from '@/collections/UserBehaviorEvents'
import { UserSessions } from '@/collections/UserSessions'

import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { SiteSettings } from '@/globals/SiteSettings'
import { plugins } from './plugins'

// Endpoints
import { sessionHandler, trackHandler } from './endpoints/analytics'
import { Redirects } from './globals/Redirects'
import { getAllowedDomains } from './utilities/getAllowedDomains'
import { validateEnv } from './utilities/validateEnv'

import { resendAdapter } from '@payloadcms/email-resend'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      title: 'LSBets Admin Panel',
      titleSuffix: ' - LSBets',
      description: 'LsBet Admin Panel - Manage your LSBet website content',
      icons: [
        {
          rel: 'icon',
          type: 'image/jpeg',
          url: 'https://ut91p27j9t.ufs.sh/f/CI2WZ5YUTq1beVeh3Fwfw9glnXS4C6WAJcNBbrvIad7PD2yU',
        },
      ],
      openGraph: {
        images: [
          {
            url: '/https://ut91p27j9t.ufs.sh/f/CI2WZ5YUTq1bdEX04uQDXpVt0zI3oulY6iq2RyfQ8bOh4wP7',
            width: 1200,
            height: 630,
            alt: 'LSBets Admin Panel',
          },
        ],
        description: 'Admin panel for LSBets website',
        siteName: 'LSBets Admin Panel',
        title: 'LSBets Panel - ',
      },
    },

    components: {
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
      graphics: {
        Logo: '@/components/Logo/Logo#Logo',
        Icon: '@/components/Logo/Logo#Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(
        dirname,
        'app',
        '(payloadAuth)',
        '(payload)',
        'admin',
        'importMap.js',
      ),
    },
    avatar: 'default' as const,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Pages,
    Categories,
    Media,
    Showcases,
    SubscriptionPlans,
    SubscriptionAddons,
    Projects,
    Tickets,
    FAQ,
    ConfiguratorOptions,
    ClientFiles,
    Roadmap,
    Notifications,
    // Analytics Collections
    UserBehaviorEvents,
    UserSessions,
    PageViews,
    HeatmapData,
    // Engagement Collections
    ProjectViews,
    ConversionFunnels,
    // Leads Collections
    ContactInquiries,
    NewsletterSubscribers,
  ],
  email:
    process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('placeholder')
      ? resendAdapter({
          defaultFromAddress: 'no-reply@mdktech.pl',
          defaultFromName: 'MDKCraft',
          apiKey: process.env.RESEND_API_KEY,
        })
      : undefined, // Payload will fallback to console logging in dev if no email adapter is provided
  sharp,
  db: mongooseAdapter({
    url: validateEnv('DATABASE_URL'),
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  endpoints: [
    {
      path: '/analytics/session',
      method: 'post',
      handler: sessionHandler,
    },
    {
      path: '/analytics/track',
      method: 'post',
      handler: trackHandler,
    },
  ],
  globals: [Header, Footer, SiteSettings, Opinions, Redirects],
  csrf: getAllowedDomains(),
  cors: getAllowedDomains(),
  plugins,
  secret: validateEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
