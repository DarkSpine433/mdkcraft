'use server'

import { ContactSubmission } from '@/types/captcha'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { validateCaptchaToken } from './verifyCaptcha'
export async function submitContactForm(data: ContactSubmission) {
  try {
    // 1. Validate required fields
    if (!data.name || !data.email || !data.projectType) {
      return {
        success: false,
        error: 'Wszystkie podstawowe dane kontaktowe muszą być wypełnione',
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

    // 6. Create contact inquiry
    await payload.create({
      collection: 'contact-inquiries',
      data: {
        sessionId: data.sessionId || 'unknown',
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',

        // I. Informacje Ogólne
        companyName: data.companyName,
        currentUrl: data.currentUrl,
        businessDescription: data.businessDescription,
        targetAudience: data.targetAudience,

        // II. Zakres i Cele
        mainGoal: data.mainGoal,
        subpagesCount: data.subpagesCount,
        extraFeatures: data.extraFeatures as any,

        // III. Design i Estetyka
        designLevel: data.designLevel as any,
        brandingStatus: data.brandingStatus as any,
        inspirationLinks: data.inspirationLinks,

        // IV. Logistyka i Treści
        contentProvider: data.contentProvider as any,
        hasDomainHosting: data.hasDomainHosting as any,
        plannedLaunchDate: data.plannedLaunchDate
          ? new Date(data.plannedLaunchDate).toISOString()
          : null,
        budgetRange: data.budgetRange,

        // Systemowe
        projectType: data.projectType as any,
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
