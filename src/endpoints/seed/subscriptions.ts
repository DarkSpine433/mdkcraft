import type { Payload, PayloadRequest } from 'payload'

export const seedSubscriptions = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding subscriptions...`)

  // Addons
  const addonsData = [
    {
      name: 'Priorytetowe Wsparcie',
      price: 200,
      description: 'Gwarantowany czas reakcji do 4h',
      slug: 'priority-support',
      type: 'recurring' as const,
      draft: false,
    },
    {
      name: 'SEO Audit',
      price: 49,
      description: 'Miesięczny audyt i raport SEO.',
      slug: 'seo-audit',
      type: 'recurring' as const,
    },
    {
      name: 'Extra Storage',
      price: 9,
      description: 'Dodatkowe 50GB przestrzeni dyskowej.',
      slug: 'extra-storage',
      type: 'recurring' as const,
    },
  ]

  const createdAddons = []
  for (const addon of addonsData) {
    const res = await payload.create({
      collection: 'subscription-addons',
      data: addon,
      req,
      draft: false,
    })
    createdAddons.push(res)
  }

  // Plans
  const plansData = [
    {
      name: 'Basic',
      price: 1000,
      slug: 'basic-plan',
      description: 'Podstawowy pakiet dla małych firm',
      features: [
        { feature: 'Strona wizytówa' },
        { feature: 'Hosting podstawowy' },
        { feature: 'Wsparcie email' },
      ],
      stripeProductID: 'prod_mock_basic',
      stripePriceID: 'price_mock_basic',
      billingCycle: 'monthly' as const,
      draft: false,
    },
    {
      name: 'Pro',
      price: 29,
      slug: 'pro',
      description: 'Dla profesjonalistów.',
      features: [
        { feature: 'Priority Support' },
        { feature: 'Unlimited Projects' },
        { feature: 'Analytics Dashboard' },
        { feature: 'Custom Domain' },
      ],
      stripeProductID: 'prod_pro',
      stripePriceID: 'price_pro',
      billingCycle: 'monthly' as const,
    },
    {
      name: 'Enterprise',
      price: 99,
      slug: 'enterprise',
      description: 'Dla dużych zespołów.',
      features: [
        { feature: 'Dedicated Manager' },
        { feature: 'SLA' },
        { feature: 'SSO' },
        { feature: 'Audit Logs' },
      ],
      stripeProductID: 'prod_enterprise', // Mock IDs
      stripePriceID: 'price_enterprise',
      billingCycle: 'yearly' as const,
    },
  ]

  for (const plan of plansData) {
    await payload.create({
      collection: 'subscription-plans',
      data: plan,
      req,
      draft: false,
    })
  }
}
