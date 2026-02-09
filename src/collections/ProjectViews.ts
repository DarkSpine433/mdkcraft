import type { CollectionConfig } from 'payload'

export const ProjectViews: CollectionConfig = {
  slug: 'project-views',
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'projectTitle',
    group: 'Engagement',
    defaultColumns: [
      'projectTitle',
      'projectCategory',
      'viewTimestamp',
      'viewDuration',
      'ctaClicked',
    ],
    description: 'Specific tracking for project showcase interactions',
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
      name: 'project',
      type: 'relationship',
      relationTo: 'showcases',
      admin: {
        description: 'Link to the actual project if available in CMS',
      },
    },
    {
      name: 'projectId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Project identifier (for projects not in CMS)',
      },
    },
    {
      name: 'projectTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'Project title (denormalized for quick access)',
      },
    },
    {
      name: 'projectCategory',
      type: 'select',
      options: [
        { label: 'E-commerce', value: 'E-commerce' },
        { label: 'FinTech', value: 'FinTech' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'AI/ML', value: 'AI/ML' },
        { label: 'Blockchain', value: 'Blockchain' },
        { label: 'IoT', value: 'IoT' },
        { label: 'SaaS', value: 'SaaS' },
        { label: 'Social', value: 'Social' },
      ],
    },
    {
      name: 'viewTimestamp',
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
      name: 'viewDuration',
      type: 'number',
      admin: {
        description: 'Time spent viewing project in seconds',
      },
    },
    {
      name: 'interactionType',
      type: 'select',
      options: [
        { label: 'Clicked from Homepage', value: 'homepage_click' },
        { label: 'Direct Link', value: 'direct_link' },
        { label: 'Category Filter', value: 'category_filter' },
        { label: 'Search Result', value: 'search_result' },
        { label: 'Related Project', value: 'related_project' },
        { label: 'Archive Browse', value: 'archive_browse' },
      ],
    },
    {
      name: 'sectionsViewed',
      type: 'array',
      fields: [
        {
          name: 'section',
          type: 'select',
          required: true,
          options: [
            { label: 'Overview', value: 'overview' },
            { label: 'Challenge', value: 'challenge' },
            { label: 'Solution', value: 'solution' },
            { label: 'Impact', value: 'impact' },
            { label: 'Tech Stack', value: 'tech_stack' },
            { label: 'Team', value: 'team' },
            { label: 'Milestones', value: 'milestones' },
            { label: 'Gallery', value: 'gallery' },
            { label: 'Testimonial', value: 'testimonial' },
          ],
        },
        {
          name: 'timeSpent',
          type: 'number',
          admin: {
            description: 'Time spent in this section (seconds)',
          },
        },
      ],
      admin: {
        description: 'Which sections of the project were viewed',
      },
    },
    {
      name: 'ctaClicked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether user clicked any call-to-action',
      },
    },
    {
      name: 'ctaType',
      type: 'select',
      options: [
        { label: 'Live Link', value: 'live_link' },
        { label: 'GitHub', value: 'github' },
        { label: 'Case Study', value: 'case_study' },
        { label: 'Contact About Project', value: 'contact' },
        { label: 'Download', value: 'download' },
      ],
      admin: {
        description: 'Which CTA was clicked',
      },
    },
    {
      name: 'previousProject',
      type: 'text',
      admin: {
        description: 'Previous project viewed (if any)',
      },
    },
    {
      name: 'nextProject',
      type: 'text',
      admin: {
        description: 'Next project viewed (if any)',
      },
    },
    {
      name: 'techStackClicked',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
        },
      ],
      admin: {
        description: 'Which technologies user clicked for more info',
      },
    },
  ],
}
