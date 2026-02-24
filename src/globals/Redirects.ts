import { adminOnly } from '@/access/adminOnly'
import { publicAccess } from '@/access/publicAccess'
import type { GlobalConfig } from 'payload'

export const Redirects: GlobalConfig = {
  slug: 'redirects',
  label: 'Przekierowania Systemowe',
  access: {
    read: publicAccess,
    update: adminOnly,
  },
  admin: {
    group: 'Admin',
    description: 'Protokół mapowania i przekierowań ruchu przychodzącego (Redirects Manager).',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Lista reguł przekierowań',
      labels: {
        singular: 'Reguła',
        plural: 'Reguły',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'from',
              label: 'Source_Path (np. /stara-strona)',
              type: 'text',
              required: true,
              admin: {
                width: '40%',
                placeholder: '/old-path',
              },
            },
            {
              name: 'to',
              label: 'Target_Path (np. /nowa-strona)',
              type: 'text',
              required: true,
              admin: {
                width: '40%',
                placeholder: '/new-path',
              },
            },
            {
              name: 'enabled',
              label: 'Włączony',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'redirectbuttontext',
              label: 'Tekst przycisku',
              type: 'text',
              required: true,
            },
            { name: 'maintenancepagesdescription', label: 'Opis', type: 'text' },
            {
              name: 'estimated-time-of-completion-of-maintenance-work',
              label: 'Czas oczekiwany na koniec utrzymania',
              type: 'date',
            },
          ],
        },
      ],
    },
  ],
}
