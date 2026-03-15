import type { CollectionBeforeChangeHook } from 'payload'

export const syncNewsletterSubscription: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req: { payload },
}) => {
  // Only run on creation or if email is changing
  if (operation === 'create' || (operation === 'update' && data.email)) {
    try {
      const existingSubscription = await payload.find({
        collection: 'newsletter-subscribers',
        where: {
          email: {
            equals: data.email,
          },
          doubleOptInConfirmed: {
            equals: true,
          },
        },
        limit: 1,
      })

      if (existingSubscription.docs.length > 0) {
        // If confirmed subscription exists, enable newsletter in user settings
        return {
          ...data,
          settings: {
            ...(data.settings || {}),
            newsletter: true,
          },
        }
      }
    } catch (error) {
      console.error('Error syncing newsletter subscription for user:', error)
    }
  }

  return data
}
