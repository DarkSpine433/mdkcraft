'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { CheckCircle2, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { AdvancedCaptcha, useAdvancedCaptcha } from './Captcha'

interface NewsletterFormData {
  email: string
  name: string
}

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'footer'
  className?: string
}

export const NewsletterSignup = ({
  variant = 'default',
  className = '',
}: NewsletterSignupProps) => {
  const [formData, setFormData] = useState<NewsletterFormData>({ email: '', name: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showCaptcha, setShowCaptcha] = useState(false)

  const { captchaToken, captchaError, isVerified, handleVerify, handleError, resetCaptcha } =
    useAdvancedCaptcha()
  const { trackFormStart, trackFormSubmit, getSessionId } = useAnalytics()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Show CAPTCHA on submit for compact variant
    if (variant === 'compact' && !showCaptcha) {
      setShowCaptcha(true)
      return
    }

    if (!isVerified) {
      setSubmitError('Proszę zweryfikować CAPTCHA')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sessionId: getSessionId(),
          captchaToken,
          source:
            variant === 'footer'
              ? 'homepage_footer'
              : variant === 'compact'
                ? 'popup'
                : 'landing_page',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        trackFormSubmit('newsletter-signup', true, {
          source: variant,
        })

        // Reset form
        setFormData({ email: '', name: '' })
        resetCaptcha()
        setShowCaptcha(false)

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Błąd subskrypcji')
      trackFormSubmit('newsletter-signup', false, {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Compact variant (e.g., for footer)
  if (variant === 'compact') {
    return (
      <div className={className}>
        <AnimatePresence mode="wait">
          {submitSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-green-500"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">Dziękujemy za subskrypcję!</span>
            </motion.div>
          ) : !showCaptcha ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              onFocus={() => trackFormStart('newsletter-signup')}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Twój adres email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? 'Wysyłanie...' : 'Subskrybuj'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="captcha"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <AdvancedCaptcha onVerify={handleVerify} onError={handleError} />
              <motion.button
                onClick={handleSubmit}
                disabled={!isVerified || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 rounded-lg bg-primary hover:bg-primary/80 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wysyłanie...' : 'Zatwierdź subskrypcję'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(submitError || captchaError) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-sm text-red-400"
            >
              {submitError || captchaError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Default variant (full form)
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 rounded-2xl border border-green-500/20 bg-green-500/10 backdrop-blur-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center mb-4"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Dziękujemy!</h3>
            <p className="text-neutral-300">
              Sprawdź swoją skrzynkę email, aby potwierdzić subskrypcję.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onSubmit={handleSubmit}
            onFocus={() => trackFormStart('newsletter-signup')}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nl-name" className="text-sm font-medium text-neutral-300">
                  Imię (opcjonalne)
                </label>
                <input
                  type="text"
                  id="nl-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Jan"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="nl-email"
                  className="text-sm font-medium text-neutral-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email *
                </label>
                <input
                  type="email"
                  id="nl-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="jan@example.com"
                />
              </div>
            </div>

            <AdvancedCaptcha onVerify={handleVerify} onError={handleError} />

            <AnimatePresence>
              {(submitError || captchaError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {submitError || captchaError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={!isVerified || isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-4 px-6 rounded-lg font-semibold text-white transition-all
                flex items-center justify-center gap-2
                ${
                  !isVerified || isSubmitting
                    ? 'bg-neutral-700 cursor-not-allowed opacity-50'
                    : 'bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Subskrybuj Newsletter
                </>
              )}
            </motion.button>

            <p className="text-xs text-neutral-500 text-center">
              Wysyłamy newsletter maksymalnie raz w tygodniu. Możesz się wypisać w każdej chwili.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
