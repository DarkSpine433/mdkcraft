import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'surname', 'email', 'roles'],
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Imię',
    },
    {
      name: 'surname',
      type: 'text',
      label: 'Nazwisko',
    },
    {
      name: 'handle',
      type: 'text',
      label: 'Pseudonim / Handle',
      unique: true,
      admin: {
        description: 'Tylko małe litery, cyfry i podkreślniki (hacker style).',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Numer telefonu',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Firma / Organizacja',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Manager',
          value: 'manager',
        },
        {
          label: 'Developer',
          value: 'developer',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Klient',
          value: 'customer',
        },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
    {
      name: 'activeSubscription',
      type: 'relationship',
      relationTo: 'subscription-plans',
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      access: {
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'activeAddons',
      type: 'relationship',
      relationTo: 'subscription-addons',
      hasMany: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'userProjects',
      type: 'join',
      collection: 'projects',
      on: 'client',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'userTickets',
      type: 'join',
      collection: 'tickets',
      on: 'client',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'userFiles',
      type: 'join',
      collection: 'client-files',
      on: 'client',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'assignedInquiries',
      type: 'join',
      collection: 'contact-inquiries',
      on: 'assignedTo',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Ustawienia Konta',
      fields: [
        {
          name: 'newsletter',
          type: 'checkbox',
          label: 'Subskrypcja Newslettera',
          defaultValue: false,
        },
        {
          name: 'marketing',
          type: 'checkbox',
          label: 'Zgody Marketingowe',
          defaultValue: false,
        },
        {
          name: 'fontSize',
          type: 'select',
          label: 'Rozmiar_Tekstu',
          options: [
            { label: 'Minimalistyczny (S)', value: 'small' },
            { label: 'Standardowy (M)', value: 'medium' },
            { label: 'Zwiększony (L)', value: 'large' },
          ],
          defaultValue: 'medium',
        },
        {
          name: 'layoutDensity',
          type: 'select',
          label: 'Zagęszczenie_Interfejsu',
          options: [
            { label: 'Kompaktowy', value: 'compact' },
            { label: 'Zbalansowany', value: 'comfortable' },
            { label: 'Przestronny', value: 'spacious' },
          ],
          defaultValue: 'comfortable',
        },
        {
          name: 'animationSpeed',
          type: 'select',
          label: 'Szybkość_Animacji',
          options: [
            { label: 'Szybka', value: 'fast' },
            { label: 'Normalna', value: 'normal' },
            { label: 'Spokojna', value: 'relaxed' },
          ],
          defaultValue: 'normal',
        },
        {
          name: 'glassIntensity',
          type: 'select',
          label: 'Intensywność_Efektu_Szkła',
          options: [
            { label: 'Niska', value: 'low' },
            { label: 'Średnia', value: 'medium' },
            { label: 'Wysoka', value: 'high' },
          ],
          defaultValue: 'medium',
        },
      ],
    },
    {
      name: 'userSessions',
      type: 'join',
      collection: 'user-sessions',
      on: 'userId',
      admin: {
        allowCreate: false,
      },
    },
  ],
}
