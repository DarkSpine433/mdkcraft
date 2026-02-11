import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
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
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
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
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
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
      admin: {
        group: 'MDKcraft',
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
        group: 'MDKcraft',
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
      admin: {
        group: 'MDKcraft',
      },
    },
    {
      name: 'userProjects',
      type: 'join',
      collection: 'projects',
      on: 'client',
      admin: {
        allowCreate: false,
        group: 'MDKcraft',
      },
    },
    {
      name: 'userTickets',
      type: 'join',
      collection: 'tickets',
      on: 'client',
      admin: {
        allowCreate: false,
        group: 'MDKcraft',
      },
    },
    {
      name: 'userFiles',
      type: 'join',
      collection: 'client-files',
      on: 'client',
      admin: {
        allowCreate: false,
        group: 'MDKcraft',
      },
    },
  ],
}
