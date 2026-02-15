import { checkRole } from '@/access/utilities'
import type { Access } from 'payload'

/**
 * Generic access checker that verifies if the user owns the document.
 * @param fieldName The name of the field that stores the owner's ID (default: 'customer')
 */
export const isOwner =
  (fieldName: string = 'customer'): Access =>
  ({ req }) => {
    // Admin has full access
    if (req.user && checkRole(['admin'], req.user)) {
      return true
    }

    // Authenticated user - return Where query to filter by the specified field
    if (req.user?.id) {
      return {
        [fieldName]: {
          equals: req.user.id,
        },
      }
    }

    // Guest - no access
    return false
  }
