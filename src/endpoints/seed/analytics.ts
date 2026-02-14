import type { Payload, PayloadRequest } from 'payload'

export const seedAnalytics = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding analytics data...`)

  // Newsletter Subscribers
  const subscribers = [
    {
      email: 'jan@example.com',
      status: 'active' as const,
      subscribedAt: new Date().toISOString(),
    },
    {
      email: 'jane.smith@example.com',
      status: 'active' as const,
      subscribedAt: new Date().toISOString(),
    },
    {
      email: 'info@business.com',
      status: 'active' as const,
      subscribedAt: new Date().toISOString(),
    },
  ]

  for (const subscriber of subscribers) {
    await payload.create({
      collection: 'newsletter-subscribers',
      data: subscriber,
      draft: false, // Added draft: false
      req,
    })
  }

  // Contact Inquiries
  const inquiries = [
    {
      name: 'Jan Kowalski',
      email: 'jan@kowalski.pl',
      message: 'Dzień dobry, jestem zainteresowany wyceną projektu sklepu internetowego.',
      subject: 'Wycena projektu e-commerce',
      status: 'new' as const,
      projectType: 'ecommerce' as const,
      submittedAt: new Date().toISOString(),
    },
    {
      name: 'Anna Nowak',
      email: 'anna.nowak@firma.pl',
      message: 'Poszukujemy agencji do rebrandingu naszej strony korporacyjnej.',
      subject: 'Zapytanie o wycenę',
      status: 'new' as const,
      projectType: 'ecommerce' as const,
      submittedAt: new Date().toISOString(),
    },
  ]

  for (const inquiry of inquiries) {
    await payload.create({
      collection: 'contact-inquiries',
      data: inquiry,
      draft: false,
      req,
    })
  }

  // Note: Skipping high-volume analytics like PageViews/UserSessions/HeatmapData
  // as they are typically auto-generated and seeding them might clutter the DB unnecessarily
  // or require complex relation mapping. Can be added if User specifically requests massive volume.
}
