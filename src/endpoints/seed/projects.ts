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
  // Pobieranie użytkownika demo
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
    payload.logger.error('— Nie znaleziono użytkownika demo, przerywam inicjalizację projektów...')
    return
  }

  payload.logger.info(`— Inicjalizacja bazy projektów MDK...`)

  // Definicja danych projektów - dodajemy brakujące pola wymagane przez schemat
  // Używamy Partial<Project>, aby uniknąć problemów z polami generowanymi przez system (id, createdAt)
  const projectsData: Partial<Project>[] = [
    {
      title: 'Platforma E-commerce NexGen',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Kompleksowa platforma e-commerce zbudowana dla globalnej marki odzieżowej. Projekt obejmował pełną migrację danych i wdrożenie headless CMS.',
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
      startDate: new Date('2025-01-01').toISOString(),
      estimatedEndDate: new Date('2025-12-31').toISOString(),
      activityLog: [
        {
          message: 'Finalizacja wdrożenia produkcyjnego',
          date: new Date().toISOString(),
        },
      ],
      figmaLink: 'https://figma.com',
      stagingLink: 'https://staging.example.com',
    },
    {
      title: 'Panel Analityczny EcoTech',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'System wizualizacji danych w czasie rzeczywistym dla sektora odnawialnych źródeł energii.',
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
      startDate: new Date('2025-02-10').toISOString(),
      estimatedEndDate: new Date('2025-06-15').toISOString(),
      activityLog: [
        {
          message: 'Optymalizacja zapytań do bazy danych',
          date: new Date().toISOString(),
        },
      ],
    },
    {
      title: 'Aplikacja FinVest',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Bezpieczna aplikacja mobilna do zarządzania mikro-inwestycjami.',
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
      startDate: new Date('2025-03-01').toISOString(),
      estimatedEndDate: new Date('2025-09-20').toISOString(),
      activityLog: [
        {
          message: 'Zakończenie testów penetracyjnych',
          date: new Date().toISOString(),
        },
      ],
    },
  ]

  for (const project of projectsData) {
    try {
      await payload.create({
        collection: 'projects',
        // Rzutowanie na 'any' w tym miejscu rozwiązuje błędy typowania Payload 3.x przy seedowaniu,
        // jeśli obiekt 'data' nie jest idealnie zmapowany na skomplikowany typ Project
        data: project as any,
        req,
      })
    } catch (err) {
      payload.logger.error(`Błąd podczas tworzenia projektu ${project.title}: ${err}`)
    }
  }

  payload.logger.info(`— Inicjalizacja projektów zakończona pomyślnie.`)
}
