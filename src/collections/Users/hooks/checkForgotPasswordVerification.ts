import type { CollectionBeforeOperationHook } from 'payload'
import { APIError } from 'payload'
import { generateVerificationEmailHtml } from '../utilities/generateVerificationEmail'

export const checkForgotPasswordVerification: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  if (operation === 'forgotPassword') {
    const { email } = (args as { email?: string }) || {}

    if (!email) return args

    const userQuery = await req.payload.find({
      collection: 'users',
      showHiddenFields: true,
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
    })

    if (userQuery.docs.length > 0) {
      const user = userQuery.docs[0]

      // If user is not verified
      if (!user._verified) {
        const now = new Date()
        const lastSent = user.lastVerificationEmailSent
          ? new Date(user.lastVerificationEmailSent as string)
          : null
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

        let count = (user.verificationEmailCount as number) || 0

        // Reset count if last sent was more than an hour ago
        if (!lastSent || lastSent < oneHourAgo) {
          count = 0
        }

        if (count >= 3) {
          throw new APIError(
            'Limit prób weryfikacji osiągnięty (max 3 na godzinę). Spróbuj ponownie później.',
            429,
          )
        }

        // Resend verification email
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const token = (user as any)._verificationToken

          if (token) {
            await req.payload.sendEmail({
              html: generateVerificationEmailHtml({ token }),
              subject: 'Weryfikacja Konta - MDKCraft',
              to: user.email,
            })
          }

          // Update counters
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              lastVerificationEmailSent: now.toISOString(),
              verificationEmailCount: count + 1,
            },
          })

          throw new APIError(
            'Twoje konto nie jest zweryfikowane. Wysłaliśmy nowy e-mail weryfikacyjny. Sprawdź swoją skrzynkę.',
            403,
          )
        } catch (_) {
          if (_ instanceof APIError) throw _
          throw new APIError(
            'Konto niezweryfikowane. Wystąpił błąd podczas wysyłania e-maila weryfikacyjnego.',
            500,
          )
        }
      }
    }
  }

  return args
}
