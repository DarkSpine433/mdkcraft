'use server'

import type { ContactInquiry as ContactInquiryType } from '@/payload-types'
import configPromise from '@payload-config'
import { ContactSubmission } from '@/types/captcha'
import { getPayload } from 'payload'
import { validateCaptchaToken } from './verifyCaptcha'
export async function submitContactForm(data: ContactSubmission) {
  try {
    // 1. Validate required fields
    if (!data.name || !data.email || !data.projectType || !data.message) {
      return {
        success: false,
        error: 'Wszystkie wymagane pola muszą być wypełnione',
      }
    }

    // 2. Verify CAPTCHA token exists
    if (!data.captchaToken) {
      return {
        success: false,
        error: 'Weryfikacja CAPTCHA jest wymagana',
      }
    }

    // 3. Validate CAPTCHA token on server
    const captchaValidation = await validateCaptchaToken(data.captchaToken)

    if (!captchaValidation.valid) {
      console.error('CAPTCHA validation failed:', captchaValidation.error)
      return {
        success: false,
        error: captchaValidation.error || 'Nieprawidłowy token CAPTCHA. Spróbuj ponownie.',
      }
    }

    // Log trust score for analytics
    console.log('CAPTCHA validated with trust score:', captchaValidation.trustScore)

    // 4. Get Payload instance
    const payload = await getPayload({ config: configPromise })

    // 5. Check for duplicate submissions (same email within last 5 minutes)
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
    const collectionDesc = payload.config.collections.find((c) => c.slug === 'contact-inquiries')

    const options = (
      collectionDesc?.fields.find((f) => 'name' in f && f.name === 'projectType') as any
    )?.options
    const validValues = options?.map((o: any) => (typeof o === 'object' ? o.value : o)) || []

    const validatedProjectType = (
      validValues.includes(data.projectType) ? data.projectType : 'other'
    ) as ContactInquiryType['projectType']

    // 6. Create contact inquiry
    await payload.create({
      collection: 'contact-inquiries',
      data: {
        sessionId: data.sessionId || 'unknown',
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        projectType: validatedProjectType == undefined ? 'other' : validatedProjectType,
        budget: (data.budget || undefined) as
          | 'under_10k'
          | '10k_50k'
          | '50k_100k'
          | '100k_250k'
          | 'over_250k'
          | 'not_sure'
          | undefined,
        timeline: (data.timeline || undefined) as
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
        formInteractionTime: data.formInteractionTime || 0,
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
      error: 'Błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
    }
  }
}
