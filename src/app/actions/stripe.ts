'use server'

import stripe from 'stripe'
import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'
import { getPayload } from 'payload'

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.patch_1' as any,
})

export async function createSubscriptionCheckoutSession(priceId: string) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Musisz być zalogowany, aby wykupić subskrypcję')
  }

  let customerId = (user as any).stripeCustomerID

  if (!customerId) {
    // Create Stripe customer
    const customer = await stripeClient.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: {
        payloadUserId: user.id,
      },
    })
    customerId = customer.id

    // Update user in Payload
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        stripeCustomerID: customerId,
      },
    })
  }

  const session = await stripeClient.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/account/dashboard?success=Subscription+active`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/kontakt`,
  })

  return { url: session.url }
}
