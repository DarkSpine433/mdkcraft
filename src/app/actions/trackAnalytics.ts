'use server'

import configPromise from '@payload-config'
import { AnalyticsEvent, SessionData } from '@/types/Analytics'
import { getPayload } from 'payload'

/**
 * Server Action - Track Analytics Events
 */
export async function trackAnalyticsEvents(data: AnalyticsEvent) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Używamy mapowania, aby upewnić się, że obiekt 'data'
    // pasuje do schematu Payload (usuwamy nadmiarowe pola jeśli istnieją)
    const promises = data.events.map((event) =>
      payload.create({
        collection: 'user-behavior-events',
        data: {
          sessionId: data.sessionId,
          eventType: event.eventType,
          eventCategory: event.eventCategory,
          elementId: event.elementId,
          elementText: event.elementText,
          elementPosition: event.elementPosition,
          pageUrl: event.pageUrl,
          referrerUrl: event.referrerUrl,
          timestamp: event.timestamp || new Date().toISOString(),
          decisionTime: event.decisionTime,
          hoverDuration: event.hoverDuration,
          scrollDepth: event.scrollDepth,
          viewportSize: event.viewportSize,
          // metadata: event.metadata // odkomentuj jeśli masz to pole w Payload
        },
      }),
    )

    await Promise.all(promises)
    return { success: true }
  } catch (_error) {
    console.error('Analytics error:', _error)
    return { success: false }
  }
}
/**
 * Server Action - Create or Update Session
 */
export async function trackSession(data: SessionData) {
  try {
    if (!data.sessionId) {
      return { success: false, error: 'Session ID required' }
    }

    const payload = await getPayload({ config: configPromise })

    // Check if session already exists
    const existingSessions = await payload.find({
      collection: 'user-sessions',
      where: {
        sessionId: {
          equals: data.sessionId,
        },
      },
      limit: 1,
    })

    if (existingSessions.docs.length > 0) {
      // Update existing session
      await payload.update({
        collection: 'user-sessions',
        id: existingSessions.docs[0].id,
        data: {
          pageViews: (existingSessions.docs[0].pageViews || 0) + 1,
          sessionEnd: new Date().toISOString(),
        },
      })
    } else {
      // Create new session
      await payload.create({
        collection: 'user-sessions',
        data: {
          ...data,
          sessionStart: data.sessionStart || new Date().toISOString(),
          pageViews: 1,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Session tracking error:', error)
    return { success: false, error: 'Failed to track session' }
  }
}
