import type { User } from '@/payload-types'
import { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

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

  const ticketsData: RequiredDataFromCollectionSlug<'tickets'>[] = [
    {
      subject: 'Błąd logowania na urządzeniach mobilnych',
      status: 'open',
      priority: 'high',
      client: user.id,
      messages: [
        {
          author: user.id,
          content:
            'Nie mogę zalogować się do konta używając iPhone 14. Przycisk "Zaloguj" nie reaguje.',
          sentAt: new Date().toISOString(),
        },
      ],
    },
    {
      subject: 'Pytanie o fakturę VAT',
      status: 'pending_client',
      priority: 'medium',
      client: user.id,
      messages: [
        {
          author: user.id,
          content: 'Czy mogę otrzymać fakturę VAT na firmę zagraniczną?',
          sentAt: new Date().toISOString(),
        },
      ],
    },
    {
      subject: 'Sugestia nowej funkcjonalności',
      status: 'closed',
      priority: 'low',
      client: user.id,
      messages: [
        {
          author: user.id,
          content: 'Byłoby świetnie, gdyby można było eksportować raporty do PDF.',
          sentAt: new Date().toISOString(),
        },
      ],
    },
  ]

  for (const ticket of ticketsData) {
    await payload.create({
      collection: 'tickets',
      data: ticket,
      req,
    })
  }
}
