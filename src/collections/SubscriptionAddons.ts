import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { adminOnly } from '@/access/adminOnly'

export const SubscriptionAddons: CollectionConfig = {
  slug: 'subscription-addons',
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Services',
    defaultColumns: ['name', 'price', 'type'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Cena doliczana do miesięcznej raty',
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'recurring',
      options: [
        { label: 'Cykliczny (miesięcznie)', value: 'recurring' },
        { label: 'Jednorazowy', value: 'one_time' },
      ],
      required: true,
    },
    {
      name: 'stripePriceId',
      type: 'text',
    },
  ],
}
