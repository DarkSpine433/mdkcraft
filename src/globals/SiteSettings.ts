import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'MDKcraft',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Modern Web Development Services',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'turnstileSiteKey',
      type: 'text',
      admin: {
        description: 'Cloudflare Turnstile Site Key',
      },
    },
    {
      name: 'contactEmail',
      type: 'text',
      defaultValue: 'kontakt@mdkcraft.pl',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
