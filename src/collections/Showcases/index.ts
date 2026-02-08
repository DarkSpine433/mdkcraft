import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Showcases: CollectionConfig = {
  slug: 'showcases',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'E-commerce', value: 'E-commerce' },
        { label: 'FinTech', value: 'FinTech' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'AI/ML', value: 'AI/ML' },
        { label: 'Blockchain', value: 'Blockchain' },
        { label: 'IoT', value: 'IoT' },
        { label: 'SaaS', value: 'SaaS' },
        { label: 'Social', value: 'Social' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Completed', value: 'completed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
    },
    {
      name: 'description',
      type: 'group',
      fields: [
        { name: 'overview', type: 'textarea', required: true },
        { name: 'challenge', type: 'textarea', required: true },
        { name: 'solution', type: 'textarea', required: true },
        { name: 'impact', type: 'textarea', required: true },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: {
            description: 'Lucide icon name (e.g., Cpu, Zap, Box)',
          },
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            { label: 'Frontend', value: 'frontend' },
            { label: 'Backend', value: 'backend' },
            { label: 'DevOps', value: 'devops' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Cloud', value: 'cloud' },
            { label: 'Core', value: 'core' },
          ],
        },
        { name: 'version', type: 'text' },
        { name: 'description', type: 'text' },
      ],
    },
    {
      name: 'team',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        {
          name: 'avatar',
          type: 'text',
          admin: {
            description: 'URL or path to avatar',
          },
        },
        { name: 'contribution', type: 'text' },
      ],
    },
    {
      name: 'milestones',
      type: 'array',
      fields: [
        { name: 'date', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'completed', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        { name: 'commits', type: 'number', required: true },
        { name: 'hoursSpent', type: 'number', required: true },
        { name: 'performanceScore', type: 'number', required: true },
        { name: 'uptime', type: 'text' },
        { name: 'users', type: 'text' },
      ],
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'live', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'caseStudy', type: 'text' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    {
      name: 'techDetails',
      type: 'group',
      fields: [
        { name: 'architecture', type: 'text' },
        { name: 'language', type: 'text' },
        { name: 'database', type: 'text' },
        { name: 'hosting', type: 'text' },
      ],
    },
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'author', type: 'text' },
        { name: 'role', type: 'text' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          required: true,
          admin: {
            description: 'Hex color (e.g., #8B5CF6)',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          admin: {
            description: 'Hex color',
          },
        },
        {
          name: 'accent',
          type: 'text',
          admin: {
            description: 'Hex color',
          },
        },
      ],
    },
    slugField({
      position: undefined,
    }),
  ],
}
