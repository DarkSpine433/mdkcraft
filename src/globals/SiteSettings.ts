import { adminOnly } from '@/access/adminOnly'
import type { GlobalConfig } from 'payload'

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
    {
      name: 'developmentMode',
      type: 'checkbox',
      label: 'Tryb Deweloperski (Tylko dla administratorów)',
      defaultValue: false,
    },
    {
      name: 'developmentBypassSecret',
      type: 'text',
      label: 'Sekretny klucz obejścia trybu deweloperskiego',
      admin: {
        description: 'Dodaj ?bypass=TWÓJ_KLUCZ do URL, aby uzyskać dostęp w trybie deweloperskim.',
      },
    },
  ],
}
