import { adminOnly } from '@/access/adminOnly'
import { isOwner } from '@/access/isOwner'
import type { CollectionConfig } from 'payload'

export const ClientFiles: CollectionConfig = {
  slug: 'client-files',
  access: {
    read: isOwner('client'),
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Management',
  },
  upload: {
    staticDir: 'public/client-files',
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
