'use server'

import { generateNewsletterConfirmationEmailHtml } from '@/collections/NewsletterSubscribers/utilities/generateNewsletterConfirmationEmail'
import configPromise from '@payload-config'
import crypto from 'crypto'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { validateCaptchaToken } from './verifyCaptcha'

interface NewsletterSubscription {
  email: string
  name?: string
  sessionId?: string
  captchaToken: string
  source?: string
}

/**
 * Server Action - Subscribe to Newsletter
 */
export async function subscribeToNewsletter(data: NewsletterSubscription) {
  try {
    // Validate required fields
    if (!data.email) {
      return { success: false, error: 'Email jest wymagany' }
    }

    // Verify CAPTCHA token
    if (!data.captchaToken) {
      return {
        success: false,
        error: 'Weryfikacja CAPTCHA jest wymagana',
      }
    }

    const captchaValidation = await validateCaptchaToken(data.captchaToken)
    if (!captchaValidation.valid) {
      return {
        success: false,
        error: 'Weryfikacja bezpieczeństwa nieudana',
      }
    }

    const payload = await getPayload({ config: configPromise })
    const headers = await getHeaders()
    const { user: authUser } = await payload.auth({ headers })

    // 1. If user is logged in and it's their email
    if (authUser && authUser.email === data.email) {
      return {
        success: true,
        redirect: '/settings#newsletter',
        message: 'Przekierowywanie do ustawień...',
      }
    }

    // Check if email exists in Users collection (even if not logged in)
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: data.email,
        },
      },
      limit: 1,
    })

    const userExists = existingUsers.docs.length > 0

    // Check if email already exists in NewsletterSubscribers
    const existingSubscribers = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: {
          equals: data.email,
        },
      },
      limit: 1,
    })

    const confirmationToken = crypto
      .createHash('sha256')
      .update(`${data.email}-${Date.now()}-${Math.random()}`)
      .digest('hex')

    if (existingSubscribers.docs.length > 0) {
      const subscriber = existingSubscribers.docs[0]

      // If already confirmed, inform user
      if (subscriber.doubleOptInConfirmed) {
        return {
          success: false,
          error: 'Ten adres email jest już zapisany do newslettera',
        }
      }

      // If not confirmed, update token and resend
      await payload.update({
        collection: 'newsletter-subscribers',
        id: subscriber.id,
        data: {
          confirmationToken,
          confirmationSentAt: new Date().toISOString(),
        },
      })
    } else {
      // Create new subscriber
      await payload.create({
        collection: 'newsletter-subscribers',
        data: {
          email: data.email,
          name: data.name,
          subscribedAt: new Date().toISOString(),
          status: 'pending',
          source: (data.source || 'landing_page') as any,
          doubleOptInConfirmed: false,
          confirmationToken,
          confirmationSentAt: new Date().toISOString(),
        },
      })
    }

    // Send confirmation email
    await payload.sendEmail({
      to: data.email,
      subject: 'Potwierdź subskrypcję Newslettera - MDKCraft',
      html: generateNewsletterConfirmationEmailHtml({ token: confirmationToken }),
    })

    return {
      success: true,
      message: userExists
        ? 'Wysłaliśmy link potwierdzający na Twój adres email powiązany z kontem.'
        : 'Sprawdź swoją skrzynkę pocztową, aby potwierdzić subskrypcję.',
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      error: 'Błąd podczas zapisywania do newslettera',
    }
  }
}
