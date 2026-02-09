import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'pageUrl',
    group: 'Analytics',
    defaultColumns: ['pageUrl', 'timestamp', 'timeOnPage', 'scrollDepth'],
    description: 'Individual page view tracking with performance metrics',
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Links to user session',
      },
    },
    {
      name: 'pageUrl',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Full URL of the page',
      },
    },
    {
      name: 'pageTitle',
      type: 'text',
      admin: {
        description: 'Page title from document.title',
      },
    },
    {
      name: 'timestamp',
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
      name: 'timeOnPage',
      type: 'number',
      admin: {
        description: 'Duration spent on page in seconds',
      },
    },
    {
      name: 'scrollDepth',
      type: 'number',
      admin: {
        description: 'Maximum scroll percentage reached (0-100)',
      },
    },
    {
      name: 'exitPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this was the exit page for the session',
      },
    },
    {
      name: 'performanceMetrics',
      type: 'group',
      fields: [
        {
          name: 'loadTime',
          type: 'number',
          admin: {
            description: 'Page load time in milliseconds',
          },
        },
        {
          name: 'timeToInteractive',
          type: 'number',
          admin: {
            description: 'Time to interactive (TTI) in milliseconds',
          },
        },
        {
          name: 'largestContentfulPaint',
          type: 'number',
          admin: {
            description: 'LCP metric in milliseconds',
          },
        },
        {
          name: 'firstInputDelay',
          type: 'number',
          admin: {
            description: 'FID metric in milliseconds',
          },
        },
        {
          name: 'cumulativeLayoutShift',
          type: 'number',
          admin: {
            description: 'CLS metric (score)',
          },
        },
      ],
    },
    {
      name: 'previousPage',
      type: 'text',
      admin: {
        description: 'Referrer URL within the site',
      },
    },
    {
      name: 'nextPage',
      type: 'text',
      admin: {
        description: 'Next page visited (if any)',
      },
    },
  ],
}
