'use client'

import { ChevronRight, Cookie, ShieldCheck, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dispatchUpdate = () => {
    window.dispatchEvent(new Event('cookie-consent-updated'))
  }

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all')
    setIsVisible(false)
    dispatchUpdate()
  }

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary')
    setIsVisible(false)
    dispatchUpdate()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-100"
        >
          <div className="bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50 opacity-50" />

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Cookie className="text-primary h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black tracking-tighter uppercase mb-1">
                    Ciasteczka_Systemu
                  </h3>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono leading-relaxed mb-6 uppercase tracking-wider">
                  Używamy plików cookie, aby zoptymalizować Twoje doświadczenie w systemie MDKcraft.
                  Niektóre są niezbędne do działania terminala.
                </p>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={acceptAll}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black tracking-widest text-[10px] uppercase h-11 rounded-xl group"
                  >
                    Akceptuj_Wszystkie{' '}
                    <ChevronRight
                      size={14}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={acceptNecessary}
                    className="w-full bg-transparent border-white/10 hover:bg-white/5 text-neutral-400 font-bold tracking-widest text-[10px] uppercase h-11 rounded-xl"
                  >
                    Tylko_Niezbędne
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 py-2 border-t border-white/5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <ShieldCheck size={12} className="text-primary" />
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
                    Zgodność z RODO / GDPR Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
