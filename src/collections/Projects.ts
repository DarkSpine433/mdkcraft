import { adminOnly } from '@/access/adminOnly'
import { isOwner } from '@/access/isOwner'
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: isOwner('client'),
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
      fields: [
        {
          name: 'message',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    slugField({
      useAsSlug: 'title',
      slugify: ({ valueToSlugify }) => {
        if (!valueToSlugify) return ''
        const base = valueToSlugify
          .toString()
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
        const randomSuffix = Math.floor(1000000000 + Math.random() * 9000000000)
        return `${base}-id-${randomSuffix}`
      },
    }),
  ],
}
