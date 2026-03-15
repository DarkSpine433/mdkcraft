import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'

import { validateEnv } from '@/utilities/validateEnv'
import { checkForgotPasswordVerification } from './hooks/checkForgotPasswordVerification'
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
  hooks: {
    beforeOperation: [checkForgotPasswordVerification],
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'surname', 'email', 'roles'],
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 1209600,
    verify: {
      generateEmailSubject: () => 'Weryfikacja Konta - MDKCraft',
      generateEmailHTML: ({ token }) => {
        const url = `${validateEnv('NEXT_PUBLIC_SERVER_URL')}/verify/${token}`
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; min-height: 100vh;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                      <!-- Header Accent -->
                      <tr><td height="4" style="background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899);"></td></tr>
                      
                      <tr>
                        <td style="padding: 50px 40px;">
                          <!-- Logo Area -->
                          <div style="margin-bottom: 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: -1px; font-weight: 700; color: #ffffff;">
                              MDK<span style="color: #06b6d4;">CRAFT</span>
                            </h1>
                            <div style="height: 1px; width: 60px; background: #06b6d4; margin: 15px auto 0;"></div>
                          </div>

                          <!-- Content -->
                          <h2 style="font-size: 22px; font-weight: 600; color: #06b6d4; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
                            Weryfikacja Systemowa
                          </h2>
                          <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 35px;">
                            Wykryto nową próbę autoryzacji konta. Aby uzyskać pełny dostęp do systemów MDKCraft, wymagane jest potwierdzenie tożsamości poprzez unikalny token weryfikacyjny.
                          </p>

                          <!-- Action Button -->
                          <div style="text-align: center; margin-bottom: 40px;">
                            <a href="${url}" style="display: inline-block; padding: 18px 36px; background-color: #06b6d4; color: #000000; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);">
                              Autoryzuj Dostęp
                            </a>
                          </div>

                          <!-- Divider -->
                          <div style="height: 1px; background: #1a1a1a; margin-bottom: 30px;"></div>

                          <!-- Secondary Info -->
                          <p style="font-size: 13px; color: #52525b; line-height: 1.5; margin: 0;">
                            Ten token wygaśnie za 24 godziny. Jeśli to nie Ty zainicjowałeś proces, prosimy o natychmiastowe zabezpieczenie systemów i ignorowanie tej wiadomości.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px 40px; background-color: #0c0c0c; border-top: 1px solid #1a1a1a; text-align: center;">
                          <p style="font-size: 12px; color: #3f3f46; margin: 0;">
                            © 2024 MDKCraft Terminal. Wszystkie systemy operacyjne chronione.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `
      },
    },
    forgotPassword: {
      generateEmailSubject: () => 'Resetowanie Klucza Dostępu - MDKCraft',
      generateEmailHTML: ({ token }) => {
        const url = `${validateEnv('NEXT_PUBLIC_SERVER_URL')}/forgot-password/${token}`
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; min-height: 100vh;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                      <!-- Header Accent -->
                      <tr><td height="4" style="background: linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b);"></td></tr>
                      
                      <tr>
                        <td style="padding: 50px 40px;">
                          <!-- Logo -->
                          <div style="margin-bottom: 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: -1px; font-weight: 700; color: #ffffff;">
                              MDK<span style="color: #8b5cf6;">CRAFT</span>
                            </h1>
                            <div style="height: 1px; width: 60px; background: #8b5cf6; margin: 15px auto 0;"></div>
                          </div>

                          <!-- Content -->
                          <h2 style="font-size: 22px; font-weight: 600; color: #8b5cf6; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
                            Procedura Resetowania Klucza
                          </h2>
                          <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 35px;">
                            Otrzymaliśmy żądanie resetu klucza dostępu (hasła) dla Twojego konta. Aby zdefiniować nową sygnaturę dostępu, skorzystaj z poniższego bezpiecznego łącza.
                          </p>

                          <!-- Action Button -->
                          <div style="text-align: center; margin-bottom: 40px;">
                            <a href="${url}" style="display: inline-block; padding: 18px 36px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);">
                              Zmień Klucz Dostępu
                            </a>
                          </div>

                          <!-- Divider -->
                          <div style="height: 1px; background: #1a1a1a; margin-bottom: 30px;"></div>

                          <!-- Warning -->
                          <p style="font-size: 13px; color: #ef4444; line-height: 1.5; margin: 0; padding: 15px; background: rgba(239, 68, 68, 0.05); border-radius: 8px; border-left: 2px solid #ef4444;">
                            <strong>UWAGA:</strong> Jeśli nie zlecałeś tej operacji, Twoje konto może być narażone na nieautoryzowany dostęp. Zignoruj tę wiadomość, a obecny klucz pozostanie aktywny.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px 40px; background-color: #0c0c0c; border-top: 1px solid #1a1a1a; text-align: center;">
                          <p style="font-size: 12px; color: #3f3f46; margin: 0;">
                            Centrum Zarządzania Bezpieczeństwem MDKCraft.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Imię',
    },
    {
      name: 'verificationEmailCount',
      type: 'number',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: 0,
    },
    {
      name: 'lastVerificationEmailSent',
      type: 'date',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
      },
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
