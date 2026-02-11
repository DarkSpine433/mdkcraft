'use server'

import config from '@/payload.config'
import crypto from 'crypto'
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

    const payload = await getPayload({ config })

    // Check if email already exists
    const existingSubscribers = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: {
          equals: data.email,
        },
      },
      limit: 1,
    })

    if (existingSubscribers.docs.length > 0) {
      const subscriber = existingSubscribers.docs[0]

      // If already confirmed, inform user
      if (subscriber.doubleOptInConfirmed) {
        return {
          success: false,
          error: 'Ten adres email jest już zapisany do newslettera',
        }
      }

      // If not confirmed, resend confirmation
      return {
        success: true,
        message: 'Email potwierdzający został wysłany ponownie. Sprawdź swoją skrzynkę pocztową.',
      }
    }

    // Generate confirmation token
    const confirmationToken = crypto
      .createHash('sha256')
      .update(`${data.email}-${Date.now()}-${Math.random()}`)
      .digest('hex')

    // Create new subscriber
    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: data.email,
        name: data.name,
        subscribedAt: new Date().toISOString(),
        status: 'pending',
        source: (data.source || 'landing_page') as
          | 'homepage_footer'
          | 'blog'
          | 'project_page'
          | 'popup'
          | 'contact_form'
          | 'landing_page'
          | 'manual_import',
        doubleOptInConfirmed: false,
        confirmationToken,
        confirmationSentAt: new Date().toISOString(),
        preferences: {
          frequency: 'weekly',
          interests: [],
          language: 'pl',
        },
      },
    })

    return {
      success: true,
      message: 'Sprawdź swoją skrzynkę pocztową, aby potwierdzić subskrypcję',
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      error: 'Błąd podczas zapisywania do newslettera',
    }
  }
}
