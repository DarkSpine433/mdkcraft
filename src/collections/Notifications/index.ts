import { isAdmin } from '@/access/isAdmin'
import { CollectionConfig, Where } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    group: 'System',
  },
  access: {
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true

      const constraint: Where = {
        or: [
          {
            recipient: {
              equals: user.id,
            },
          },
          {
            broadcast: {
              equals: true,
            },
          },
        ],
      }

      return constraint
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Wygrana', value: 'win' },
        { label: 'Bonus', value: 'bonus' },
        { label: 'Alert', value: 'alert' },
      ],
      defaultValue: 'info',
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      admin: { condition: (data) => !data.broadcast },
    },
    { name: 'broadcast', label: 'Wyślij do wszystkich', type: 'checkbox', defaultValue: false },
    {
      name: 'isReadBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { readOnly: true },
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
