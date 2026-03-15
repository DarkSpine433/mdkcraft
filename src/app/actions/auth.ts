'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export const verifyEmailAction = async ({ token }: { token: string }) => {
  const payload = await getPayload({ config })

  try {
    const result = await payload.verifyEmail({
      collection: 'users',
      token,
    })

    if (result) {
      return { isSuccess: true }
    }
    return { isSuccess: false, message: 'Nieprawidłowy token weryfikacyjny.' }
  } catch (error) {
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas weryfikacji.',
    }
  }
}
