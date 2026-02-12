import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { adminOnly } from '@/access/adminOnly'

export const Roadmap: CollectionConfig = {
  slug: 'roadmap',
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'priority'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'planned',
      options: [
        { label: 'Planowane', value: 'planned' },
        { label: 'W trakcie', value: 'in_progress' },
        { label: 'Ukończone', value: 'completed' },
        { label: 'Anulowane', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Niski', value: 'low' },
        { label: 'Średni', value: 'medium' },
        { label: 'Wysoki', value: 'high' },
      ],
    },
    {
      name: 'expectedRelease',
      type: 'text',
      admin: {
        placeholder: 'Q3 2025',
      },
    },
    {
      name: 'votes',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
