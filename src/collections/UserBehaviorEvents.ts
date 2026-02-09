import type { CollectionConfig } from 'payload'

export const UserBehaviorEvents: CollectionConfig = {
  slug: 'user-behavior-events',
  access: {
    read: ({ req: { user } }) => {
      // Only admins can read analytics
      return !!user
    },
    create: () => true, // Allow API to create events
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'eventType',
    group: 'Analytics',
    defaultColumns: ['eventType', 'eventCategory', 'pageUrl', 'timestamp'],
    description: 'Tracks all user interactions and behavior events',
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Links to user session for grouping events',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Click', value: 'click' },
        { label: 'Hover', value: 'hover' },
        { label: 'Scroll', value: 'scroll' },
        { label: 'Focus', value: 'focus' },
        { label: 'Blur', value: 'blur' },
        { label: 'Submit', value: 'submit' },
        { label: 'Navigation', value: 'navigation' },
        { label: 'Page Load', value: 'page_load' },
        { label: 'Page Exit', value: 'page_exit' },
        { label: 'Video Play', value: 'video_play' },
        { label: 'Video Pause', value: 'video_pause' },
        { label: 'Download', value: 'download' },
        { label: 'Error', value: 'error' },
      ],
    },
    {
      name: 'eventCategory',
      type: 'select',
      required: true,
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Link', value: 'link' },
        { label: 'Form', value: 'form' },
        { label: 'Project', value: 'project' },
        { label: 'Navigation', value: 'navigation' },
        { label: 'Media', value: 'media' },
        { label: 'CTA', value: 'cta' },
        { label: 'Social', value: 'social' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'elementId',
      type: 'text',
      admin: {
        description: 'HTML element ID or unique identifier',
      },
    },
    {
      name: 'elementText',
      type: 'text',
      admin: {
        description: 'Text content of the interacted element',
      },
    },
    {
      name: 'elementPosition',
      type: 'json',
      admin: {
        description: 'X/Y coordinates of the element or click position',
      },
    },
    {
      name: 'pageUrl',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Current page URL where event occurred',
      },
    },
    {
      name: 'referrerUrl',
      type: 'text',
      admin: {
        description: 'Previous page URL',
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
      name: 'decisionTime',
      type: 'number',
      admin: {
        description: 'Time in milliseconds user spent on page before this action',
      },
    },
    {
      name: 'hoverDuration',
      type: 'number',
      admin: {
        description: 'Time in milliseconds user hovered before clicking',
      },
    },
    {
      name: 'scrollDepth',
      type: 'number',
      admin: {
        description: 'Percentage of page scrolled (0-100)',
      },
    },
    {
      name: 'viewportSize',
      type: 'json',
      admin: {
        description: 'Window dimensions {width, height}',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Flexible JSON field for additional context',
      },
    },
  ],
}
