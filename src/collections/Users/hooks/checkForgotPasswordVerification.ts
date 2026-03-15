import type { CollectionBeforeOperationHook } from 'payload'
import { APIError } from 'payload'

export const checkForgotPasswordVerification: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  if (operation === 'forgotPassword') {
    const { email } = args

    if (!email) return args

    const userQuery = await req.payload.find({
      collection: 'users',
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
          // In Payload 3.0, we can use the forgotPassword operation's logic or custom
          // But for verification, we use sendVerificationEmail if available or trigger it.
          // Since we are in beforeOperation 'forgotPassword', we want to stop this and send Verification instead.

          await req.payload.sendVerificationEmail({
            collection: 'users',
            user,
          })

          // Update counters
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              verificationEmailCount: count + 1,
              lastVerificationEmailSent: now.toISOString(),
            },
          })

          throw new APIError(
            'Twoje konto nie jest zweryfikowane. Wysłaliśmy nowy e-mail weryfikacyjny. Sprawdź swoją skrzynkę.',
            403,
          )
        } catch (err) {
          if (err instanceof APIError) throw err
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
