import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { adminOrSelf } from '@/access/adminOrSelf'

export const ClientFiles: CollectionConfig = {
  slug: 'client-files',
  access: {
    read: adminOrSelf,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Management',
  },
  upload: {
    staticDir: 'client-vault',
    mimeTypes: ['image/*', 'application/pdf', 'application/zip'],
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
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
