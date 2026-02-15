import { adminOnly } from '@/access/adminOnly'
import { anyone } from '@/access/anyone'
import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  access: {
    read: adminOnly,
    create: anyone,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Leads',
    defaultColumns: ['email', 'name', 'status', 'subscribedAt', 'doubleOptInConfirmed'],
    description: 'Newsletter subscription management with preferences',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'subscribedAt',
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
      defaultValue: 'pending',
      options: [
        { label: 'Pending Confirmation', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Complained', value: 'complained' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Homepage Footer', value: 'homepage_footer' },
        { label: 'Blog', value: 'blog' },
        { label: 'Project Page', value: 'project_page' },
        { label: 'Popup', value: 'popup' },
        { label: 'Contact Form', value: 'contact_form' },
        { label: 'Landing Page', value: 'landing_page' },
        { label: 'Manual Import', value: 'manual_import' },
      ],
      admin: {
        description: 'Where they subscribed from',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: [
            { label: 'Client', value: 'client' },
            { label: 'Prospect', value: 'prospect' },
            { label: 'Partner', value: 'partner' },
            { label: 'Developer', value: 'developer' },
            { label: 'Designer', value: 'designer' },
            { label: 'Entrepreneur', value: 'entrepreneur' },
            { label: 'Student', value: 'student' },
          ],
        },
      ],
      admin: {
        description: 'Subscriber segments for targeted campaigns',
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'weekly',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Bi-weekly', value: 'biweekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Major Updates Only', value: 'major_updates' },
          ],
        },
        {
          name: 'interests',
          type: 'array',
          fields: [
            {
              name: 'interest',
              type: 'select',
              options: [
                { label: 'Web Development', value: 'web_dev' },
                { label: 'AI & Machine Learning', value: 'ai_ml' },
                { label: 'Blockchain & Web3', value: 'blockchain' },
                { label: 'E-commerce', value: 'ecommerce' },
                { label: 'UI/UX Design', value: 'design' },
                { label: 'Mobile Development', value: 'mobile' },
                { label: 'DevOps', value: 'devops' },
                { label: 'Case Studies', value: 'case_studies' },
                { label: 'Industry News', value: 'news' },
              ],
            },
          ],
        },
        {
          name: 'language',
          type: 'select',
          defaultValue: 'pl',
          options: [
            { label: 'Polish', value: 'pl' },
            { label: 'English', value: 'en' },
          ],
        },
      ],
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When they unsubscribed',
      },
    },
    {
      name: 'unsubscribeReason',
      type: 'select',
      options: [
        { label: 'Too Frequent', value: 'too_frequent' },
        { label: 'Not Relevant', value: 'not_relevant' },
        { label: 'Never Subscribed', value: 'never_subscribed' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'doubleOptInConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Email confirmation verified',
      },
    },
    {
      name: 'confirmationSentAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'confirmationToken',
      type: 'text',
      admin: {
        description: 'Unique token for email confirmation',
      },
    },
    {
      name: 'lastEmailSent',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Last newsletter sent to this subscriber',
      },
    },
    {
      name: 'emailsSent',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total emails sent to this subscriber',
      },
    },
    {
      name: 'emailsOpened',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total emails opened',
      },
    },
    {
      name: 'linksClicked',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total links clicked in emails',
      },
    },
  ],
}
