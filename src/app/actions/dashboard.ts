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
  await payload.update({
    collection: 'notifications',
    where: {
      recipient: { equals: user.id },
      isRead: { equals: false },
    },
    data: {
      isRead: true,
    },
  })

  // 2. Mark broadcast notifications (this is trickier as it's a relationship)
  // For simplicity, we fetch them and update individual ones
  const unreadBroadcasts = await payload.find({
    collection: 'notifications',
    where: {
      broadcast: { equals: true },
      // Theoretically we should check if user.id is NOT in isReadBy
      // But Payload 'not_in' might be complex here.
    },
  })

  for (const doc of unreadBroadcasts.docs) {
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
