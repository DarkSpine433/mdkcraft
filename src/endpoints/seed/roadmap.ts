import type { Payload, PayloadRequest } from 'payload'

export const seedRoadmap = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding roadmap...`)

  const roadmapData = [
    {
      title: 'Dark Mode',
      description: 'Systemowy tryb ciemny dla całej aplikacji.',
      status: 'completed',
      date: '2025-01-15',
      type: 'feature',
    },
    {
      title: 'Mobile App Beta',
      description: 'Testy beta aplikacji mobilnej na iOS i Android.',
      status: 'in_progress',
      date: '2025-06-01',
      type: 'feature',
    },
    {
      title: 'API v2',
      description: 'Nowa wersja API z GraphQL.',
      status: 'planned',
      date: '2025-12-01',
      type: 'technical',
    },
    {
      title: 'Integracja z AI',
      description: 'Analiza danych z wykorzystaniem sztucznej inteligencji.',
      status: 'planned',
      date: '2026-03-01',
      type: 'feature',
    },
  ]

  for (const item of roadmapData) {
    // @ts-ignore
    await payload.create({
      collection: 'roadmap',
      data: item,
      req,
    })
  }
}
