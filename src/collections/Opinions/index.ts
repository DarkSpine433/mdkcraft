import type { GlobalConfig } from 'payload'

export const Opinions: GlobalConfig = {
  slug: 'opinions',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },

  fields: [
    {
      name: 'opinions',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'opinion',
          type: 'text',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
  ],
}
