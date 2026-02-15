'use client'

import { getAnalyticsTracker } from '@/lib/analytics/tracker'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface AnalyticsContextValue {
  sessionId: string | null
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  sessionId: null,
})

export const useAnalyticsContext = () => useContext(AnalyticsContext)

interface AnalyticsProviderProps {
  children: ReactNode
  enabled?: boolean
}

/**
 * Analytics Provider Component
 * Wraps the app to provide analytics throughout
 */
export const AnalyticsProvider = ({ children, enabled = true }: AnalyticsProviderProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent')
      if (consent === 'all') {
        const tracker = getAnalyticsTracker()
        setSessionId(tracker.getSessionId())
        return tracker
      }
      return null
    }

    let tracker = checkConsent()

    // Listen for consent changes
    const handleStorageChange = () => {
      if (!tracker) {
        tracker = checkConsent()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // Custom event for same-window updates
    window.addEventListener('cookie-consent-updated', handleStorageChange)

    return () => {
      if (tracker) {
        tracker.destroy()
      }
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cookie-consent-updated', handleStorageChange)
    }
  }, [enabled])

  return <AnalyticsContext.Provider value={{ sessionId }}>{children}</AnalyticsContext.Provider>
}
