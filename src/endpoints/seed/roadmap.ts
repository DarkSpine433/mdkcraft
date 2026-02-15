import { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

export const seedRoadmap = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding roadmap...`)

  const roadmapData: RequiredDataFromCollectionSlug<'roadmap'>[] = [
    {
      title: 'Dark Mode',
      description: 'Systemowy tryb ciemny dla całej aplikacji.',
      status: 'completed',
      expectedRelease: '2025-01-15',
      priority: 'high',
    },
    {
      title: 'Mobile App Beta',
      description: 'Testy beta aplikacji mobilnej na iOS i Android.',
      status: 'in_progress',
      expectedRelease: '2025-06-01',
      priority: 'medium',
    },
    {
      title: 'API v2',
      description: 'Nowa wersja API z GraphQL.',
      status: 'planned',
      expectedRelease: '2025-12-01',
      priority: 'medium',
    },
    {
      title: 'Integracja z AI',
      description: 'Analiza danych z wykorzystaniem sztucznej inteligencji.',
      status: 'planned',
      expectedRelease: '2026-03-01',
      priority: 'low',
    },
  ]

  for (const item of roadmapData) {
    await payload.create({
      collection: 'roadmap',
      data: item,
      req,
    })
  }
}
