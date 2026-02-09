/**
 * Analytics Tracker
 * Core utility for tracking user behavior and analytics events
 */

interface AnalyticsEvent {
  eventType: string
  eventCategory: string
  elementId?: string
  elementText?: string
  elementPosition?: { x: number; y: number }
  pageUrl: string
  referrerUrl?: string
  timestamp: Date
  decisionTime?: number
  hoverDuration?: number
  scrollDepth?: number
  viewportSize?: { width: number; height: number }
  metadata?: Record<string, any>
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
  sessionStart: Date
  pageViews: number
}

class AnalyticsTracker {
  private sessionId: string | null = null
  private eventQueue: AnalyticsEvent[] = []
  private batchSize = 10
  private batchInterval = 30000 // 30 seconds
  private batchTimer: NodeJS.Timeout | null = null
  private pageLoadTime: number = Date.now()
  private hoverStartTime: number | null = null
  private hoveredElement: HTMLElement | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession()
      this.setupEventListeners()
      this.startBatchTimer()
    }
  }

  /**
   * Generate or retrieve session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Initialize tracking session
   */
  private initializeSession(): void {
    // Check for existing session
    const existingSessionId = sessionStorage.getItem('analytics_session_id')
    const sessionStartTime = sessionStorage.getItem('analytics_session_start')

    // Session expires after 30 minutes of inactivity
    const SESSION_TIMEOUT = 30 * 60 * 1000
    const now = Date.now()

    if (
      existingSessionId &&
      sessionStartTime &&
      now - parseInt(sessionStartTime) < SESSION_TIMEOUT
    ) {
      this.sessionId = existingSessionId
      // Update last activity
      sessionStorage.setItem('analytics_session_start', now.toString())
    } else {
      // Create new session
      this.sessionId = this.generateSessionId()
      sessionStorage.setItem('analytics_session_id', this.sessionId)
      sessionStorage.setItem('analytics_session_start', now.toString())

      // Track session start
      this.trackSessionStart()
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string | null {
    return this.sessionId
  }

  /**
   * Detect device type
   */
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' | 'unknown' {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet'
    }
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    ) {
      return 'mobile'
    }
    return 'desktop'
  }

  /**
   * Parse user agent
   */
  private parseUserAgent(): {
    browserName: string
    browserVersion: string
    os: string
  } {
    const ua = navigator.userAgent
    let browserName = 'Unknown'
    let browserVersion = 'Unknown'
    let os = 'Unknown'

    // Browser detection
    if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox'
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown'
    } else if (ua.indexOf('SamsungBrowser') > -1) {
      browserName = 'Samsung Internet'
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      browserName = 'Opera'
    } else if (ua.indexOf('Trident') > -1) {
      browserName = 'Internet Explorer'
    } else if (ua.indexOf('Edge') > -1) {
      browserName = 'Edge'
    } else if (ua.indexOf('Chrome') > -1) {
      browserName = 'Chrome'
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown'
    } else if (ua.indexOf('Safari') > -1) {
      browserName = 'Safari'
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown'
    }

    // OS detection
    if (ua.indexOf('Win') > -1) os = 'Windows'
    else if (ua.indexOf('Mac') > -1) os = 'MacOS'
    else if (ua.indexOf('Linux') > -1) os = 'Linux'
    else if (ua.indexOf('Android') > -1) os = 'Android'
    else if (ua.indexOf('like Mac') > -1) os = 'iOS'

    return { browserName, browserVersion, os }
  }

  /**
   * Extract UTM parameters from URL
   */
  private getUtmParams(): SessionData['utmParams'] {
    const params = new URLSearchParams(window.location.search)
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
    }
  }

  /**
   * Track session start
   */
  private async trackSessionStart(): Promise<void> {
    if (!this.sessionId) return

    const { browserName, browserVersion, os } = this.parseUserAgent()

    const sessionData: SessionData = {
      sessionId: this.sessionId,
      deviceType: this.getDeviceType(),
      browserName,
      browserVersion,
      os,
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height,
      },
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      entryPage: window.location.href,
      landingSource: document.referrer || 'direct',
      utmParams: this.getUtmParams(),
      sessionStart: new Date(),
      pageViews: 1,
    }

    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      })
    } catch (error) {
      console.error('Failed to track session start:', error)
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: Partial<AnalyticsEvent>): void {
    if (!this.sessionId) return

    const fullEvent: AnalyticsEvent = {
      eventType: event.eventType || 'custom',
      eventCategory: event.eventCategory || 'other',
      pageUrl: window.location.href,
      referrerUrl: document.referrer,
      timestamp: new Date(),
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      ...event,
    }

    this.eventQueue.push(fullEvent)

    // Send batch if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.sendBatch()
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageTitle?: string): void {
    this.pageLoadTime = Date.now()

    this.trackEvent({
      eventType: 'page_load',
      eventCategory: 'navigation',
      metadata: {
        pageTitle: pageTitle || document.title,
        path: window.location.pathname,
      },
    })
  }

  /**
   * Track scroll depth
   */
  private trackScrollDepth(): void {
    const scrollPercentage =
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

    this.trackEvent({
      eventType: 'scroll',
      eventCategory: 'navigation',
      scrollDepth: Math.min(Math.round(scrollPercentage), 100),
    })
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.sendBatch() // Send remaining events before leaving
    })

    // Track scroll (throttled)
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => this.trackScrollDepth(), 500)
    })

    // Track link clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link) {
        const decisionTime = this.hoverStartTime ? Date.now() - this.hoverStartTime : undefined

        this.trackEvent({
          eventType: 'click',
          eventCategory: 'link',
          elementId: link.id || link.href,
          elementText: link.textContent?.trim().substring(0, 100),
          elementPosition: { x: e.clientX, y: e.clientY },
          decisionTime,
          hoverDuration:
            this.hoveredElement === link && this.hoverStartTime
              ? Date.now() - this.hoverStartTime
              : undefined,
          metadata: {
            href: link.href,
            target: link.target,
          },
        })
      }

      // Track button clicks
      const button = target.closest('button')
      if (button) {
        this.trackEvent({
          eventType: 'click',
          eventCategory: 'button',
          elementId: button.id || button.name,
          elementText: button.textContent?.trim().substring(0, 100),
          elementPosition: { x: e.clientX, y: e.clientY },
          decisionTime: this.hoverStartTime ? Date.now() - this.hoverStartTime : undefined,
        })
      }
    })

    // Track hover events
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('a') || target.closest('button')) {
        this.hoverStartTime = Date.now()
        this.hoveredElement = target
      }
    })

    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement
      if (target === this.hoveredElement) {
        this.hoverStartTime = null
        this.hoveredElement = null
      }
    })
  }

  /**
   * Send batched events to server
   */
  private async sendBatch(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.sessionId) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events,
        }),
      })
    } catch (error) {
      console.error('Failed to send analytics batch:', error)
      // Re-add events to queue on failure
      this.eventQueue.unshift(...events)
    }
  }

  /**
   * Start batch timer
   */
  private startBatchTimer(): void {
    this.batchTimer = setInterval(() => {
      this.sendBatch()
    }, this.batchInterval)
  }

  /**
   * Stop tracking and cleanup
   */
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer)
    }
    this.sendBatch()
  }
}

// Singleton instance
let trackerInstance: AnalyticsTracker | null = null

export const getAnalyticsTracker = (): AnalyticsTracker => {
  if (!trackerInstance && typeof window !== 'undefined') {
    trackerInstance = new AnalyticsTracker()
  }
  return trackerInstance!
}

export default AnalyticsTracker
