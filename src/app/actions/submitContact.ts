'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'

interface ContactSubmission {
  name: string
  email: string
  phone?: string
  company?: string
  projectType: string
  budget?: string
  timeline?: string
  message: string
  sessionId?: string
  captchaToken: string
  formInteractionTime?: number
  ipAddress?: string
}

/**
 * Server Action - Submit Contact Form
 */
export async function submitContactForm(data: ContactSubmission) {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.projectType || !data.message) {
      return {
        success: false,
        error: 'Wszystkie wymagane pola muszą być wypełnione',
      }
    }

    // Verify CAPTCHA token
    if (!data.captchaToken) {
      return {
        success: false,
        error: 'Weryfikacja CAPTCHA jest wymagana',
      }
    }

    const payload = await getPayload({ config })

    // Check for duplicate submissions (same email within last 5 minutes)
    const recentSubmissions = await payload.find({
      collection: 'contact-inquiries',
      where: {
        and: [
          {
            email: {
              equals: data.email,
            },
          },
          {
            submittedAt: {
              greater_than: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            },
          },
        ],
      },
      limit: 1,
    })

    if (recentSubmissions.docs.length > 0) {
      return {
        success: false,
        error: 'Wiadomość została już wysłana. Proszę poczekać przed kolejną próbą.',
      }
    }

    // Create contact inquiry
    await payload.create({
      collection: 'contact-inquiries',
      data: {
        sessionId: data.sessionId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        projectType: data.projectType as
          | 'ecommerce'
          | 'ai_ml'
          | 'blockchain'
          | 'custom_app'
          | 'mobile'
          | 'design'
          | 'consulting'
          | 'maintenance'
          | 'other',
        budget: data.budget as
          | 'under_10k'
          | '10k_50k'
          | '50k_100k'
          | '100k_250k'
          | 'over_250k'
          | 'not_sure'
          | undefined,
        timeline: data.timeline as
          | 'urgent'
          | '1_3_months'
          | '3_6_months'
          | '6_plus_months'
          | 'flexible'
          | undefined,
        message: data.message,
        submittedAt: new Date().toISOString(),
        status: 'new',
        source: 'contact_form',
        formInteractionTime: data.formInteractionTime,
        ipAddress: data.ipAddress || 'unknown',
      },
    })

    return {
      success: true,
      message: 'Wiadomość została wysłana pomyślnie',
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return {
      success: false,
      error: 'Błąd podczas wysyłania wiadomości',
    }
  }
}
