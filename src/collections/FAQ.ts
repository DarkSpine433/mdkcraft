import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { adminOnly } from '@/access/adminOnly'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'question',
    group: 'Content',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Ogólne', value: 'general' },
        { label: 'Techniczne', value: 'technical' },
        { label: 'Płatności', value: 'billing' },
        { label: 'Hosting', value: 'hosting' },
      ],
    },
  ],
}
