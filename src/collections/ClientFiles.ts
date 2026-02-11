import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { checkRole } from '@/access/utilities'

export const ClientFiles: CollectionConfig = {
  slug: 'client-files',
  access: {
    read: ({ req: { user } }) => {
      if (user && checkRole(['admin'], user)) {
        return true
      }
      if (user) {
        return {
          client: {
            equals: user.id,
          },
        }
      }
      return false
    },
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
