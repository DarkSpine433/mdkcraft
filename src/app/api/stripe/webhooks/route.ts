import { NextRequest, NextResponse } from 'next/server'
import stripe from 'stripe'
import config from '@/payload.config'
import { getPayload } from 'payload'

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.patch_1' as any, // Use latest or appropriate version
})

const webhookSecret = process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        // Find user by stripeCustomerId
        const users = (await payload.find({
          collection: 'users',
          where: {
            stripeCustomerID: { equals: stripeCustomerId },
          },
        })) as { docs: any[] }

        if (users.docs.length > 0) {
          const user = users.docs[0]
          const priceId = subscription.items.data[0].price.id

          // Find subscription plan by stripePriceId
          const plans = (await payload.find({
            collection: 'subscription-plans',
            where: {
              stripePriceId: { equals: priceId },
            },
          })) as { docs: any[] }

          if (plans.docs.length > 0) {
            await payload.update({
              collection: 'users',
              id: user.id,
              data: {
                activeSubscription: plans.docs[0].id,
              },
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        const users = (await payload.find({
          collection: 'users',
          where: {
            stripeCustomerID: { equals: stripeCustomerId },
          },
        })) as { docs: any[] }

        if (users.docs.length > 0) {
          await payload.update({
            collection: 'users',
            id: users.docs[0].id,
            data: {
              activeSubscription: null,
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as stripe.Invoice
        // Here you could implement automatic invoicing logic
        // For example, sending an email with the PDF link from Stripe
        console.log(`Invoice ${invoice.id} paid for customer ${invoice.customer}`)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error handling stripe webhook:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
