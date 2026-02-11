import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { publicAccess } from '@/access/publicAccess'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Services',
    defaultColumns: ['name', 'price', 'billingCycle'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Miesięczna cena podstawowa',
      },
    },
    {
      name: 'billingCycle',
      type: 'select',
      defaultValue: 'monthly',
      options: [
        { label: 'Miesięcznie', value: 'monthly' },
        { label: 'Rocznie', value: 'yearly' },
      ],
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        description: 'ID ceny ze Stripe (dla subskrypcji)',
      },
    },
  ],
}
