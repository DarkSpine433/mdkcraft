export interface SessionData {
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

// Precyzyjne typy zgodne z Twoją konfiguracją Payload
export type AllowedEventTypes =
  | 'error'
  | 'click'
  | 'hover'
  | 'scroll'
  | 'focus'
  | 'blur'
  | 'submit'
  | 'navigation'
  | 'page_load'
  | 'page_exit'
  | 'video_play'
  | 'video_pause'
  | 'download'

export type AllowedEventCategories =
  | 'media'
  | 'link'
  | 'project'
  | 'form'
  | 'navigation'
  | 'button'
  | 'cta'
  | 'social'
  | 'other'

export interface AnalyticsEvent {
  sessionId: string
  events: Array<{
    eventType: AllowedEventTypes
    eventCategory: AllowedEventCategories // Poprawione ze string
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
