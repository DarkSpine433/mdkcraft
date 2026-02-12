'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { Check, Shield } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useState } from 'react'

export const AdvancedCaptcha = ({
  onVerify,
  onError,
  mode = 'auto',
}: {
  onVerify: (token: string, trustScore: number) => void
  onError?: (err: string) => void
  mode?: 'slider' | 'image' | 'math' | 'auto'
}) => {
  const [isVerified, setIsVerified] = useState(false)

  const handleSuccess = (token: string) => {
    setIsVerified(true)
    onVerify(token, 100) // Turnstile doesn't give a score like my custom one, so 100 for success
  }

  const handleError = () => {
    onError?.('Weryfikacja Turnstile nieudana')
  }

  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 text-green-400 font-medium p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30 shadow-lg shadow-green-500/10"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30">
          <Check className="w-5 h-5 text-green-400" strokeWidth={3} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-white">Zweryfikowano pomyślnie</div>
          <div className="text-xs text-green-400/80">Bezpieczne połączenie zintegrowane</div>
        </div>
        <Shield className="w-5 h-5 text-green-400/60" />
      </motion.div>
    )
  }

  return (
    <div className="flex justify-center p-4 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm">
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

/**
 * Hook for using Turnstile Captcha
 */
export const useAdvancedCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [trustScore, setTrustScore] = useState<number>(0)

  const handleVerify = useCallback((token: string, score: number) => {
    setCaptchaToken(token)
    setTrustScore(score)
    setCaptchaError(null)
  }, [])

  const handleError = useCallback((error: string) => {
    setCaptchaError(error)
    setCaptchaToken(null)
    setTrustScore(0)
  }, [])

  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null)
    setCaptchaError(null)
    setTrustScore(0)
  }, [])

  return {
    captchaToken,
    captchaError,
    trustScore,
    isVerified: !!captchaToken,
    handleVerify,
    handleError,
    resetCaptcha,
  }
}
