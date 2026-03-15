'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function confirmNewsletterSubscription(token: string) {
  try {
    if (!token) {
      return { success: false, error: 'Brak tokenu weryfikacyjnego' }
    }

    const payload = await getPayload({ config: configPromise })

    // Find subscriber by token
    const subscribers = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        confirmationToken: {
          equals: token,
        },
      },
      limit: 1,
    })

    if (subscribers.docs.length === 0) {
      return { success: false, error: 'Nieprawidłowy lub wygasły token' }
    }

    const subscriber = subscribers.docs[0]

    // Update subscriber status
    await payload.update({
      collection: 'newsletter-subscribers',
      id: subscriber.id,
      data: {
        status: 'active',
        doubleOptInConfirmed: true,
        confirmationToken: null, // Clear token after use
      },
    })

    // Sync with User collection if account exists
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: subscriber.email,
        },
      },
      limit: 1,
    })

    if (users.docs.length > 0) {
      await payload.update({
        collection: 'users',
        id: users.docs[0].id,
        data: {
          settings: {
            ...users.docs[0].settings,
            newsletter: true,
          },
        },
      })
    }

    return { success: true, message: 'Subskrypcja została potwierdzona!' }
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return { success: false, error: 'Wystąpił błąd podczas potwierdzania subskrypcji' }
  }
}
