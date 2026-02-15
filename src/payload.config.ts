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
import { Opinions } from '@/collections/Opinions'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
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
  sharp,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
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
  globals: [Header, Footer, SiteSettings, Opinions],
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
