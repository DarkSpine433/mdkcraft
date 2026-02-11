import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { publicAccess } from '@/access/publicAccess'

export const ConfiguratorOptions: CollectionConfig = {
  slug: 'configurator-options',
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'label',
    group: 'Services',
    defaultColumns: ['label', 'category', 'price'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Typ Projektu', value: 'type' },
        { label: 'Ilość Podstron', value: 'pages' },
        { label: 'Design', value: 'design' },
        { label: 'Funkcje', value: 'features' },
        { label: 'SEO & Marketing', value: 'marketing' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
