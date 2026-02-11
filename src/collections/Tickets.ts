import type { CollectionConfig } from 'payload'
import { adminOrSelf } from '@/access/adminOrSelf'

export const Tickets: CollectionConfig = {
  slug: 'tickets',
  access: {
    read: adminOrSelf,
    create: adminOrSelf,
    update: adminOrSelf,
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
  },
  admin: {
    useAsTitle: 'subject',
    group: 'Management',
    defaultColumns: ['subject', 'client', 'status', 'priority', 'createdAt'],
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Otwarty', value: 'open' },
        { label: 'W trakcie', value: 'in_progress' },
        { label: 'Oczekuje na klienta', value: 'pending_client' },
        { label: 'Rozwiązany', value: 'resolved' },
        { label: 'Zamknięty', value: 'closed' },
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
        { label: 'Krytyczny', value: 'critical' },
      ],
      required: true,
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          defaultValue: ({ user }) => user?.id,
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'sentAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
  ],
}
