import { adminOnly } from '@/access/adminOnly'
import { anyone } from '@/access/anyone'
import type { CollectionConfig } from 'payload'

export const UserSessions: CollectionConfig = {
  slug: 'user-sessions',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        userId: {
          equals: user.id,
        },
      }
    },
    create: anyone,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'sessionId',
    group: 'Analytics',
    defaultColumns: ['sessionId', 'deviceType', 'entryPage', 'sessionStart', 'converted'],
    description: 'Tracks complete user sessions from entry to exit',
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique session identifier (UUID)',
      },
    },
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Linked user if logged in',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Full user agent string',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'User IP address (consider privacy implications)',
      },
    },
    {
      name: 'deviceType',
      type: 'select',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'browserName',
      type: 'text',
    },
    {
      name: 'browserVersion',
      type: 'text',
    },
    {
      name: 'os',
      type: 'text',
      admin: {
        description: 'Operating system',
      },
    },
    {
      name: 'screenResolution',
      type: 'json',
      admin: {
        description: 'Screen dimensions {width, height}',
      },
    },
    {
      name: 'language',
      type: 'text',
      admin: {
        description: 'Browser language preference',
      },
    },
    {
      name: 'timezone',
      type: 'text',
      admin: {
        description: 'User timezone',
      },
    },
    {
      name: 'entryPage',
      type: 'text',
      required: true,
      admin: {
        description: 'First page visited in session',
      },
    },
    {
      name: 'exitPage',
      type: 'text',
      admin: {
        description: 'Last page visited before session ended',
      },
    },
    {
      name: 'landingSource',
      type: 'text',
      admin: {
        description: 'UTM source, referrer domain, or direct',
      },
    },
    {
      name: 'utmParams',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },
    {
      name: 'sessionStart',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'sessionEnd',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'sessionDuration',
      type: 'number',
      admin: {
        description: 'Total session duration in seconds',
      },
    },
    {
      name: 'pageViews',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of pages viewed',
      },
    },
    {
      name: 'bounced',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'User left after viewing only one page',
      },
    },
    {
      name: 'converted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'User completed a desired action (form, newsletter, etc.)',
      },
    },
    {
      name: 'conversionType',
      type: 'select',
      options: [
        { label: 'Contact Form', value: 'contact_form' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Project Inquiry', value: 'project_inquiry' },
        { label: 'Download', value: 'download' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of conversion if converted',
      },
    },
  ],
}
