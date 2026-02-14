import type { User } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

export const seedTickets = async ({
  payload,
  req,
  user,
}: {
  payload: Payload
  req: PayloadRequest
  user: User
}): Promise<void> => {
  payload.logger.info(`— Seeding tickets...`)

  const ticketsData = [
    {
      subject: 'Błąd logowania na urządzeniach mobilnych',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Nie mogę zalogować się do konta używając iPhone 14. Przycisk "Zaloguj" nie reaguje.',
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
      status: 'open' as const,
      priority: 'high' as const,
      type: 'bug' as const,
      relatedTo: {
        relationTo: 'users',
        value: user.id,
      },
    },
    {
      subject: 'Pytanie o fakturę VAT',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Czy mogę otrzymać fakturę VAT na firmę zagraniczną?',
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
      status: 'pending_client' as const,
      priority: 'medium' as const,
      type: 'billing' as const,
      relatedTo: {
        relationTo: 'users',
        value: user.id,
      },
    },
    {
      subject: 'Sugestia nowej funkcjonalności',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Byłoby świetnie, gdyby można było eksportować raporty do PDF.',
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
      status: 'closed' as const,
      priority: 'low' as const,
      type: 'feature_request' as const,
      relatedTo: {
        relationTo: 'users',
        value: user.id,
      },
    },
  ]

  for (const ticket of ticketsData) {
    // @ts-ignore
    await payload.create({
      collection: 'tickets',
      data: ticket,
      req,
    })
  }
}
