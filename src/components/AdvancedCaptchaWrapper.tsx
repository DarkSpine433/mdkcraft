'use client'

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

// Import typu bez importowania komponentu
type AdvancedCaptchaProps = ComponentProps<typeof import('./Captcha').AdvancedCaptcha>

// Dynamic import z wyłączonym SSR
const AdvancedCaptchaComponent = dynamic(
  () => import('./Captcha').then((mod) => ({ default: mod.AdvancedCaptcha })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-5 bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center text-xs text-neutral-400 uppercase tracking-wider font-bold">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
            <span>Ładowanie weryfikacji...</span>
          </div>
        </div>
        <div className="h-16 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
      </div>
    ),
  },
)

export const AdvancedCaptcha = (props: AdvancedCaptchaProps) => {
  return <AdvancedCaptchaComponent {...props} />
}

// Re-export hook
export { useAdvancedCaptcha } from './Captcha'
