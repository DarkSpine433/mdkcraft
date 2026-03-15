import type { CollectionConfig } from 'payload'

export const ContactInquiries: CollectionConfig = {
  slug: 'contact-inquiries',
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Leads',
    defaultColumns: ['name', 'email', 'projectType', 'status', 'submittedAt'],
    description: 'Contact form submissions with tracking context',
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      index: true,
      admin: {
        description: 'Links to user session',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'projectType',
      type: 'select',
      required: true,
      options: [
        { label: 'Wizytówka', value: 'business_card' },
        { label: 'Landing Page', value: 'landing_page' },
        { label: 'Sklep E-commerce', value: 'ecommerce' },
        { label: 'System / Portal', value: 'portal' },
        { label: 'Inny', value: 'other' },
      ],
    },
    {
      name: 'budget',
      type: 'select',
      options: [
        { label: 'Under 10k PLN', value: 'under_10k' },
        { label: '10k - 50k PLN', value: '10k_50k' },
        { label: '50k - 100k PLN', value: '50k_100k' },
        { label: '100k - 250k PLN', value: '100k_250k' },
        { label: 'Over 250k PLN', value: 'over_250k' },
        { label: 'Not Sure', value: 'not_sure' },
      ],
    },
    {
      name: 'timeline',
      type: 'select',
      options: [
        { label: 'Urgent (ASAP)', value: 'urgent' },
        { label: '1-3 months', value: '1_3_months' },
        { label: '3-6 months', value: '3_6_months' },
        { label: '6+ months', value: '6_plus_months' },
        { label: 'Flexible', value: 'flexible' },
      ],
    },
    {
      name: 'companyName',
      type: 'text',
    },
    {
      name: 'currentUrl',
      type: 'text',
    },
    {
      name: 'businessDescription',
      type: 'textarea',
    },
    {
      name: 'targetAudience',
      type: 'textarea',
    },
    {
      name: 'mainGoal',
      type: 'textarea',
    },
    {
      name: 'subpagesCount',
      type: 'text',
    },
    {
      name: 'extraFeatures',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Formularz kontaktowy', value: 'contact_form' },
        { label: 'System rezerwacji / Kalendarz', value: 'booking' },
        { label: 'Wielojęzyczność', value: 'multi_lang' },
        { label: 'Social Media', value: 'social' },
        { label: 'Blog / Aktualności', value: 'blog' },
        { label: 'Płatności online', value: 'payments' },
        { label: 'Inne', value: 'other' },
      ],
    },
    {
      name: 'designLevel',
      type: 'select',
      options: [
        { label: 'Profil Standard', value: 'standard' },
        { label: 'Strategic Design', value: 'strategic' },
        { label: 'Experience (High-End)', value: 'experience' },
      ],
    },
    {
      name: 'brandingStatus',
      type: 'select',
      options: [
        { label: 'Pełna (Logo, księga znaku, kolory)', value: 'full' },
        { label: 'Tylko Logo', value: 'logo_only' },
        { label: 'Brak', value: 'none' },
      ],
    },
    {
      name: 'inspirationLinks',
      type: 'textarea',
    },
    {
      name: 'contentProvider',
      type: 'select',
      options: [
        { label: 'Klient', value: 'client' },
        { label: 'Agencja (MDKcraft)', value: 'agency' },
        { label: 'Mieszane', value: 'mixed' },
      ],
    },
    {
      name: 'hasDomainHosting',
      type: 'select',
      options: [
        { label: 'Tak', value: 'yes' },
        { label: 'Nie', value: 'no' },
      ],
    },
    {
      name: 'plannedLaunchDate',
      type: 'date',
    },
    {
      name: 'budgetRange',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      admin: {
        description: 'Dodatkowe uwagi od klienta',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Proposal Sent', value: 'proposal_sent' },
        { label: 'Negotiating', value: 'negotiating' },
        { label: 'Converted', value: 'converted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        description: 'Lead status in the sales pipeline',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Page where they submitted the form',
      },
    },
    {
      name: 'referringProject',
      type: 'relationship',
      relationTo: 'showcases',
      admin: {
        description: 'If contacted from a specific project page',
      },
    },
    {
      name: 'formInteractionTime',
      type: 'number',
      admin: {
        description: 'Time spent filling out the form in seconds',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'For spam prevention and rate limiting',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this inquiry',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Sales rep or team member assigned to this lead',
      },
    },
  ],
}
