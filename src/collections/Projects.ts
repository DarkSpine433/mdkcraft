import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { adminOrSelf } from '@/access/adminOrSelf'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: adminOrSelf,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Management',
    defaultColumns: ['title', 'client', 'status', 'progress'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'planning',
      options: [
        { label: 'Planowanie', value: 'planning' },
        { label: 'W trakcie projektowania', value: 'designing' },
        { label: 'W trakcie programowania', value: 'development' },
        { label: 'Testy', value: 'testing' },
        { label: 'Ukończono', value: 'completed' },
        { label: 'Zawieszono', value: 'on_hold' },
      ],
      required: true,
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'Procentowe ukończenie projektu',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'estimatedEndDate',
      type: 'date',
    },
    {
      name: 'figmaLink',
      type: 'text',
    },
    {
      name: 'stagingLink',
      type: 'text',
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscription-plans',
    },
    {
      name: 'activityLog',
      type: 'array',
      admin: {
        description: 'Log aktywności projektu widoczny dla klienta',
      },
      fields: [
        {
          name: 'message',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          required: true,
        },
      ],
    },
  ],
}
