import { getAnalyticsTracker } from '@/lib/analytics/tracker'
import { useCallback, useEffect, useRef } from 'react'

interface TrackEventOptions {
  eventType: string
  eventCategory: string
  elementId?: string
  elementText?: string
  metadata?: Record<string, any>
}

interface TrackProjectViewOptions {
  projectId: string
  projectTitle: string
  projectCategory?: string
  interactionType?: string
}

/**
 * React hook for analytics tracking
 */
export const useAnalytics = () => {
  const tracker = useRef(getAnalyticsTracker())
  const pageLoadTime = useRef(Date.now())

  // Initialize page view tracking
  useEffect(() => {
    tracker.current.trackPageView(document.title)

    // Track page exit
    return () => {
      const timeOnPage = Math.floor((Date.now() - pageLoadTime.current) / 1000)
      tracker.current.trackEvent({
        eventType: 'page_exit',
        eventCategory: 'navigation',
        metadata: {
          timeOnPage,
        },
      })
    }
  }, [])

  /**
   * Track a custom event
   */
  const trackEvent = useCallback((options: TrackEventOptions) => {
    tracker.current.trackEvent(options)
  }, [])

  /**
   * Track button click with decision time
   */
  const trackButtonClick = useCallback(
    (buttonId: string, buttonText: string, metadata?: Record<string, any>) => {
      const decisionTime = Date.now() - pageLoadTime.current

      tracker.current.trackEvent({
        eventType: 'click',
        eventCategory: 'button',
        elementId: buttonId,
        elementText: buttonText,
        decisionTime,
        metadata,
      })
    },
    [],
  )

  /**
   * Track project view
   */
  const trackProjectView = useCallback((options: TrackProjectViewOptions) => {
    tracker.current.trackEvent({
      eventType: 'project_view',
      eventCategory: 'project',
      elementId: options.projectId,
      elementText: options.projectTitle,
      metadata: {
        projectCategory: options.projectCategory,
        interactionType: options.interactionType,
      },
    })
  }, [])

  /**
   * Track form interaction
   */
  const trackFormStart = useCallback((formId: string) => {
    tracker.current.trackEvent({
      eventType: 'focus',
      eventCategory: 'form',
      elementId: formId,
      metadata: {
        action: 'start',
      },
    })
  }, [])

  const trackFormSubmit = useCallback(
    (formId: string, success: boolean, metadata?: Record<string, any>) => {
      tracker.current.trackEvent({
        eventType: 'submit',
        eventCategory: 'form',
        elementId: formId,
        metadata: {
          success,
          ...metadata,
        },
      })
    },
    [],
  )

  /**
   * Track CTA click
   */
  const trackCTAClick = useCallback((ctaId: string, ctaText: string, ctaType: string) => {
    const decisionTime = Date.now() - pageLoadTime.current

    tracker.current.trackEvent({
      eventType: 'click',
      eventCategory: 'cta',
      elementId: ctaId,
      elementText: ctaText,
      decisionTime,
      metadata: {
        ctaType,
      },
    })
  }, [])

  /**
   * Track navigation
   */
  const trackNavigation = useCallback((destination: string, source: string) => {
    tracker.current.trackEvent({
      eventType: 'navigation',
      eventCategory: 'navigation',
      metadata: {
        destination,
        source,
      },
    })
  }, [])

  /**
   * Track video interaction
   */
  const trackVideoPlay = useCallback((videoId: string, videoTitle: string) => {
    tracker.current.trackEvent({
      eventType: 'video_play',
      eventCategory: 'media',
      elementId: videoId,
      elementText: videoTitle,
    })
  }, [])

  const trackVideoPause = useCallback((videoId: string, currentTime: number, duration: number) => {
    tracker.current.trackEvent({
      eventType: 'video_pause',
      eventCategory: 'media',
      elementId: videoId,
      metadata: {
        currentTime,
        duration,
        percentageWatched: (currentTime / duration) * 100,
      },
    })
  }, [])

  /**
   * Track download
   */
  const trackDownload = useCallback((fileName: string, fileType: string) => {
    tracker.current.trackEvent({
      eventType: 'download',
      eventCategory: 'media',
      elementText: fileName,
      metadata: {
        fileType,
      },
    })
  }, [])

  /**
   * Track error
   */
  const trackError = useCallback((errorMessage: string, errorContext?: string) => {
    tracker.current.trackEvent({
      eventType: 'error',
      eventCategory: 'other',
      metadata: {
        errorMessage,
        errorContext,
        url: window.location.href,
      },
    })
  }, [])

  /**
   * Get session ID
   */
  const getSessionId = useCallback(() => {
    return tracker.current.getSessionId()
  }, [])

  return {
    trackEvent,
    trackButtonClick,
    trackProjectView,
    trackFormStart,
    trackFormSubmit,
    trackCTAClick,
    trackNavigation,
    trackVideoPlay,
    trackVideoPause,
    trackDownload,
    trackError,
    getSessionId,
  }
}
