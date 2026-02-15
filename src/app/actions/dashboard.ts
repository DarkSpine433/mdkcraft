'use server'

import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export async function updateUserSettings(data: any) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  const updatedUser = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      settings: data.settings,
    },
  })

  revalidatePath('/settings')
  return updatedUser
}

export async function exportUserData() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Fetch full user data including linked collections for transparency
  const fullUser = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 1,
  })

  return JSON.stringify(fullUser, null, 2)
}

export async function anonymizeUserData() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      name: 'ANONYMIZED',
      surname: 'USER',
      handle: `anon_${user.id.slice(-6)}`,
      phone: '',
      company: '',
      settings: {
        newsletter: false,
        marketing: false,
      },
    },
  })

  revalidatePath('/account')
  revalidatePath('/settings/privacy')
  return { success: true }
}

export async function updateUserData(data: {
  name?: string
  surname?: string
  handle?: string
  phone?: string
  company?: string
  password?: string
}) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Handle regex: only lowercase, numbers, underscores
  if (data.handle && !/^[a-z0-9_]+$/.test(data.handle)) {
    throw new Error('Invalid handle format. Use lowercase, numbers, and underscores only.')
  }

  // Phone regex: International format (+XX...)
  if (data.phone && !/^\+[1-9]\d{1,14}$/.test(data.phone.replace(/\s/g, ''))) {
    throw new Error('Invalid phone format. Use international format (e.g., +48123456789).')
  }

  const updatedUser = await payload.update({
    collection: 'users',
    id: user.id,
    data: data,
  })

  revalidatePath('/account')
  return updatedUser
}

export async function markNotificationAsRead(id: string) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check if it's a broadcast notification
  const notification = await payload.findByID({
    collection: 'notifications',
    id,
  })

  if (notification.broadcast) {
    // For broadcast, add user to isReadBy if not already there
    const isReadBy =
      (notification.isReadBy as any[])?.map((u) => (typeof u === 'string' ? u : u.id)) || []
    if (!isReadBy.includes(user.id)) {
      await payload.update({
        collection: 'notifications',
        id,
        data: {
          isReadBy: [...isReadBy, user.id],
        },
      })
    }
  } else {
    // For personal, just set isRead to true
    await payload.update({
      collection: 'notifications',
      id,
      data: {
        isRead: true,
      },
    })
  }

  revalidatePath('/notifications')
  revalidatePath('/dashboard')
}

export async function markAllNotificationsAsRead() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Mark personal notifications
  const personalUnread = await payload.find({
    collection: 'notifications',
    where: {
      recipient: { equals: user.id },
      isRead: { equals: false },
    },
    limit: 100,
  })

  for (const doc of personalUnread.docs) {
    await payload.update({
      collection: 'notifications',
      id: doc.id,
      data: {
        isRead: true,
      },
    })
  }

  // 2. Mark broadcast notifications
  const broadcasts = await payload.find({
    collection: 'notifications',
    where: {
      broadcast: { equals: true },
    },
    limit: 100,
  })

  for (const doc of broadcasts.docs) {
    const isReadBy = (doc.isReadBy as any[])?.map((u) => (typeof u === 'string' ? u : u.id)) || []
    if (!isReadBy.includes(user.id)) {
      await payload.update({
        collection: 'notifications',
        id: doc.id,
        data: {
          isReadBy: [...isReadBy, user.id],
        },
      })
    }
  }

  revalidatePath('/notifications')
  revalidatePath('/dashboard')
}

export async function createTicket(data: {
  subject: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  message: string
}) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  const ticket = await payload.create({
    collection: 'tickets',
    data: {
      subject: data.subject,
      priority: data.priority,
      client: user.id,
      status: 'open',
      messages: [
        {
          author: user.id,
          content: data.message,
          sentAt: new Date().toISOString(),
        },
      ],
    },
  })

  revalidatePath('/tickets')
  return ticket
}

export async function addTicketMessage(ticketId: string, content: string) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  const ticket = await payload.findByID({
    collection: 'tickets',
    id: ticketId,
  })

  // Security check: ensure user owns ticket or is admin
  if (
    typeof ticket.client === 'string' ? ticket.client !== user.id : ticket.client.id !== user.id
  ) {
    const isAdmin = user.roles?.includes('admin')
    if (!isAdmin) throw new Error('Forbidden')
  }

  const updatedTicket = await payload.update({
    collection: 'tickets',
    id: ticketId,
    data: {
      messages: [
        ...(ticket.messages || []),
        {
          author: user.id,
          content,
          sentAt: new Date().toISOString(),
        },
      ],
      // If it's the client responding, set status back to open if it was pending_client
      status: ticket.status === 'pending_client' ? 'open' : ticket.status,
    },
  })

  revalidatePath('/tickets')
  return updatedTicket
}

export async function getUnreadNotificationsCount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) return 0

  // Personal unread
  const personal = await payload.count({
    collection: 'notifications',
    where: {
      recipient: { equals: user.id },
      isRead: { equals: false },
    },
  })

  // Broadcast unread - checking if user.id is in isReadBy
  // Since Payload doesn't support "not in" easily for relationship arrays in where queries
  // we fetch broadcasts and filter manually
  const broadcasts = await payload.find({
    collection: 'notifications',
    where: {
      broadcast: { equals: true },
    },
    limit: 100, // Reasonable limit for active broadcasts
  })

  const unreadBroadcastCount = broadcasts.docs.filter((doc) => {
    const readBy = (doc.isReadBy as any[])?.map((u) => (typeof u === 'string' ? u : u.id)) || []
    return !readBy.includes(user.id)
  }).length

  return personal.totalDocs + unreadBroadcastCount
}
