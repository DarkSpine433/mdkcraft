'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'

interface AnalyticsEvent {
  sessionId: string
  events: Array<{
    eventType: string
    eventCategory: string
    elementId?: string
    elementText?: string
    elementPosition?: { x: number; y: number }
    pageUrl: string
    referrerUrl?: string
    timestamp: string
    decisionTime?: number
    hoverDuration?: number
    scrollDepth?: number
    viewportSize?: { width: number; height: number }
    metadata?: Record<string, unknown>
  }>
}

/**
 * Server Action - Track Analytics Events
 */
export async function trackAnalyticsEvents(data: AnalyticsEvent) {
  try {
    if (!data.sessionId || !data.events || !Array.isArray(data.events)) {
      return { success: false, error: 'Invalid request body' }
    }

    const payload = await getPayload({ config })

    // Insert events in batch
    const promises = data.events.map((event) =>
      payload.create({
        collection: 'user-behavior-events',
        data: {
          sessionId: data.sessionId,
          ...event,
          timestamp: event.timestamp || new Date().toISOString(),
        },
      }),
    )

    await Promise.all(promises)

    return { success: true, count: data.events.length }
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return { success: false, error: 'Failed to track events' }
  }
}

interface SessionData {
  sessionId: string
  userId?: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  browserName?: string
  browserVersion?: string
  os?: string
  screenResolution?: { width: number; height: number }
  language?: string
  timezone?: string
  entryPage: string
  landingSource?: string
  utmParams?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
  sessionStart: string
  pageViews: number
}

/**
 * Server Action - Create or Update Session
 */
export async function trackSession(data: SessionData) {
  try {
    if (!data.sessionId) {
      return { success: false, error: 'Session ID required' }
    }

    const payload = await getPayload({ config })

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
