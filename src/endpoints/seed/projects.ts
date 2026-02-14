import type { Category, Media, Project } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

export const seedProjects = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
  media?: Media[]
  categories?: Category[]
}): Promise<void> => {
  const user = await payload
    .find({
      collection: 'users',
      where: {
        email: {
          equals: 'customer@example.com',
        },
      },
    })
    .then((res) => res.docs[0])

  if (!user) {
    payload.logger.error('— No demo user found, skipping projects seed...')
    return
  }
  payload.logger.info(`— Seeding projects...`)

  const projectsData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'slug'>[] = [
    {
      title: 'NexGen E-commerce Platform',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Kompleksowa platforma e-commerce zbudowana dla globalnej marki odzieżowej. Projekt obejmował pełną migrację danych, integrację z systemami ERP oraz wdrożenie headless CMS.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      client: user.id,
      status: 'completed',
      progress: 100,
    },
    {
      title: 'EcoTech Dashboard',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Panel analityczny dla systemów zarządzania energią. Wizualizacja danych w czasie rzeczywistym i raportowanie zużycia.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      client: user.id,
      status: 'completed',
      progress: 100,
    },
    {
      title: 'FinVest Mobile App',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Aplikacja mobilna dla sektora fintech umożliwiająca inwestowanie w mikro-portfele. Bezpieczeństwo i intuicyjność jako priorytety.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      client: user.id,
      status: 'completed',
      progress: 100,
    },
  ]

  for (const project of projectsData) {
    await payload.create({
      collection: 'projects',
      data: project,
      req,
    })
  }
}
