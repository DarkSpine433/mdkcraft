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
