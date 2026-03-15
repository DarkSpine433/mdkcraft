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
            and: [
              {
                broadcast: {
                  equals: true,
                },
              },
              {
                onlyForUsersCreatedBefore: {
                  greater_than_equal: user.createdAt,
                },
              },
            ],
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
      name: 'onlyForUsersCreatedBefore',
      label: 'Pokaż użytkownikom zarejestrowanym przed',
      type: 'date',
      admin: {
        condition: (data) => data?.broadcast,
        description: 'Użytkownicy zarejestrowani po tej dacie nie zobaczą tego powiadomienia.',
      },
      validate: (val, { data }) => {
        const typedData = data as { broadcast?: boolean }
        if (typedData?.broadcast && !val) {
          return 'To pole jest wymagane, gdy wysyłasz do wszystkich.'
        }
        return true
      },
    },
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
