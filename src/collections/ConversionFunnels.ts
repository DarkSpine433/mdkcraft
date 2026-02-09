import type { CollectionConfig } from 'payload'

export const ConversionFunnels: CollectionConfig = {
  slug: 'conversion-funnels',
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'funnelName',
    group: 'Engagement',
    defaultColumns: ['funnelName', 'currentStep', 'completed', 'droppedOffAt', 'totalDuration'],
    description: 'Track conversion funnel steps and drop-off rates',
  },
  fields: [
    {
      name: 'funnelName',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact Form Funnel', value: 'contact_form' },
        { label: 'Project View to Inquiry', value: 'project_to_inquiry' },
        { label: 'Newsletter Signup', value: 'newsletter_signup' },
        { label: 'Homepage to Contact', value: 'homepage_to_contact' },
        { label: 'Archive Browse to Inquiry', value: 'archive_to_inquiry' },
        { label: 'Blog to Newsletter', value: 'blog_to_newsletter' },
      ],
    },
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
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'stepName',
          type: 'text',
          required: true,
        },
        {
          name: 'stepUrl',
          type: 'text',
          admin: {
            description: 'URL or page identifier for this step',
          },
        },
        {
          name: 'stepOrder',
          type: 'number',
          required: true,
        },
        {
          name: 'requiredAction',
          type: 'text',
          admin: {
            description: 'What user needs to do at this step',
          },
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'completedAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'timeSpent',
          type: 'number',
          admin: {
            description: 'Time spent on this step in seconds',
          },
        },
      ],
    },
    {
      name: 'currentStep',
      type: 'number',
      required: true,
      admin: {
        description: 'Current step number (where user is in funnel)',
      },
    },
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the entire funnel was completed',
      },
    },
    {
      name: 'droppedOffAt',
      type: 'number',
      admin: {
        description: 'Step number where user abandoned the funnel',
      },
    },
    {
      name: 'startedAt',
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
      name: 'completedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'totalDuration',
      type: 'number',
      admin: {
        description: 'Total time to complete funnel in seconds',
      },
    },
    {
      name: 'entrySource',
      type: 'text',
      admin: {
        description: 'How user entered this funnel',
      },
    },
    {
      name: 'dropoffReason',
      type: 'select',
      options: [
        { label: 'Navigation Away', value: 'navigation_away' },
        { label: 'Session Timeout', value: 'timeout' },
        { label: 'Form Error', value: 'form_error' },
        { label: 'Page Load Issue', value: 'load_issue' },
        { label: 'Unknown', value: 'unknown' },
      ],
      admin: {
        description: 'Reason for abandoning the funnel',
      },
    },
  ],
}
