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

    // Initialize tracker on client side only
    const tracker = getAnalyticsTracker()
    setSessionId(tracker.getSessionId())

    // Cleanup on unmount
    return () => {
      tracker.destroy()
    }
  }, [enabled])

  return <AnalyticsContext.Provider value={{ sessionId }}>{children}</AnalyticsContext.Provider>
}
