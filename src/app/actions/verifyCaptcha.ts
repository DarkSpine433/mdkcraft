'use server'

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Verify Cloudflare Turnstile Token
 */
export async function verifyCaptcha(token: string) {
  try {
    if (!token) {
      return {
        verified: false,
        error: 'Token jest wymagany',
      }
    }

    const secret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'

    const formData = new FormData()
    formData.append('secret', secret)
    formData.append('response', token)

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    })

    const outcome: TurnstileResponse = await result.json()

    if (outcome.success) {
      return {
        verified: true,
        trustScore: 100,
      }
    } else {
      console.error('Turnstile verification failed:', outcome['error-codes'])
      return {
        verified: false,
        error: 'Weryfikacja bezpieczeństwa nieudana',
      }
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return {
      verified: false,
      error: 'Błąd podczas weryfikacji bezpieczeństwa',
    }
  }
}

/**
 * Alias for verifyCaptcha to maintain compatibility with existing code
 */
export async function validateCaptchaToken(token: string) {
  const result = await verifyCaptcha(token)
  return {
    valid: result.verified,
    error: result.error,
    trustScore: result.trustScore,
  }
}

// Keep these as stubs if they are used elsewhere to prevent build errors
export async function generateImageChallenge() { return {} }
export async function generateMathChallenge() { return {} }
