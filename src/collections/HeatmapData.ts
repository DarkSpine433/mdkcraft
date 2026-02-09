import type { CollectionConfig } from 'payload'

export const HeatmapData: CollectionConfig = {
  slug: 'heatmap-data',
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'pageUrl',
    group: 'Analytics',
    defaultColumns: ['pageUrl', 'elementSelector', 'clickCount', 'date'],
    description: 'Aggregated click and scroll heatmap data for visualization',
  },
  fields: [
    {
      name: 'pageUrl',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Page identifier for heatmap',
      },
    },
    {
      name: 'elementSelector',
      type: 'text',
      admin: {
        description: 'CSS selector for the element',
      },
    },
    {
      name: 'elementType',
      type: 'select',
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Link', value: 'link' },
        { label: 'Image', value: 'image' },
        { label: 'Text', value: 'text' },
        { label: 'Form Field', value: 'form_field' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'clickCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of clicks on this element',
      },
    },
    {
      name: 'hoverCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of hovers',
      },
    },
    {
      name: 'averageHoverDuration',
      type: 'number',
      admin: {
        description: 'Average hover time in milliseconds',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Date for time-series analysis (aggregated by day)',
      },
    },
    {
      name: 'deviceBreakdown',
      type: 'group',
      fields: [
        {
          name: 'desktop',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'mobile',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'tablet',
          type: 'number',
          defaultValue: 0,
        },
      ],
      admin: {
        description: 'Click counts by device type',
      },
    },
    {
      name: 'clickPositions',
      type: 'array',
      fields: [
        {
          name: 'x',
          type: 'number',
          required: true,
        },
        {
          name: 'y',
          type: 'number',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
        },
      ],
      admin: {
        description: 'Individual click coordinates for heatmap visualization',
      },
    },
    {
      name: 'scrollDepthDistribution',
      type: 'group',
      fields: [
        {
          name: 'depth_0_25',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users who scrolled 0-25%',
          },
        },
        {
          name: 'depth_25_50',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users who scrolled 25-50%',
          },
        },
        {
          name: 'depth_50_75',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users who scrolled 50-75%',
          },
        },
        {
          name: 'depth_75_100',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users who scrolled 75-100%',
          },
        },
      ],
      admin: {
        description: 'Distribution of scroll depths for this page',
      },
    },
  ],
}
