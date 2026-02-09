'use client'

import { submitContactForm } from '@/app/actions/submitContact'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { useAdvancedCaptcha } from './Captcha'

// Dynamic import CAPTCHA bez SSR
const AdvancedCaptcha = dynamic(
  () => import('./Captcha').then((mod) => ({ default: mod.AdvancedCaptcha })),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 bg-white/5 rounded-2xl border border-white/10 animate-pulse flex items-center justify-center">
        <span className="text-neutral-500 text-sm">Ładowanie weryfikacji...</span>
      </div>
    ),
  },
)

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  message: string
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formStartTime] = useState(() => (typeof window !== 'undefined' ? Date.now() : 0))

  const {
    captchaToken,
    captchaError,
    trustScore,
    isVerified,
    handleVerify,
    handleError,
    resetCaptcha,
  } = useAdvancedCaptcha()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isVerified) {
      setSubmitError('Proszę zweryfikować CAPTCHA')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const formInteractionTime = Math.floor((Date.now() - formStartTime) / 1000)

    try {
      // Użyj server action zamiast API endpoint
      const result = await submitContactForm({
        ...formData,
        captchaToken: captchaToken || '',
        formInteractionTime,
      })

      if (result.success) {
        setSubmitSuccess(true)

        // Reset form
        setFormData(initialFormData)
        resetCaptcha()
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Błąd wysyłania formularza')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-md"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
            </div>
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Dziękujemy za wiadomość!</h3>
            <p className="text-neutral-300 max-w-md">
              Otrzymaliśmy Twoją wiadomość i skontaktujemy się z Tobą w ciągu 24 godzin.
            </p>
            {trustScore > 0 && (
              <p className="text-sm text-green-400/80">
                Poziom zaufania: {trustScore}% • Weryfikacja przebiegła pomyślnie
              </p>
            )}
          </div>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-600/80 text-white font-semibold transition-all shadow-lg shadow-primary/20"
          >
            Wyślij kolejną wiadomość
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-neutral-300 flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Imię i Nazwisko *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Jan Kowalski"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-300 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="jan@example.com"
          />
        </div>
      </div>

      {/* Phone and Company Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-neutral-300 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="+48 123 456 789"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="company"
            className="text-sm font-medium text-neutral-300 flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Firma
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Nazwa firmy"
          />
        </div>
      </div>

      {/* Project Type and Budget Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="projectType" className="text-sm font-medium text-neutral-300">
            Typ Projektu *
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            value={formData.projectType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-neutral-900">
              Wybierz typ projektu
            </option>
            <option value="ecommerce" className="bg-neutral-900">
              E-commerce
            </option>
            <option value="ai_ml" className="bg-neutral-900">
              AI/ML Integration
            </option>
            <option value="blockchain" className="bg-neutral-900">
              Blockchain/Web3
            </option>
            <option value="custom_app" className="bg-neutral-900">
              Custom Web App
            </option>
            <option value="mobile" className="bg-neutral-900">
              Mobile App
            </option>
            <option value="design" className="bg-neutral-900">
              UI/UX Design
            </option>
            <option value="consulting" className="bg-neutral-900">
              Consulting
            </option>
            <option value="maintenance" className="bg-neutral-900">
              Maintenance/Support
            </option>
            <option value="other" className="bg-neutral-900">
              Inne
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium text-neutral-300">
            Budżet
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-neutral-900">
              Wybierz zakres budżetu
            </option>
            <option value="under_10k" className="bg-neutral-900">
              Poniżej 10k PLN
            </option>
            <option value="10k_50k" className="bg-neutral-900">
              10k - 50k PLN
            </option>
            <option value="50k_100k" className="bg-neutral-900">
              50k - 100k PLN
            </option>
            <option value="100k_250k" className="bg-neutral-900">
              100k - 250k PLN
            </option>
            <option value="over_250k" className="bg-neutral-900">
              Powyżej 250k PLN
            </option>
            <option value="not_sure" className="bg-neutral-900">
              Nie jestem pewien
            </option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <label htmlFor="timeline" className="text-sm font-medium text-neutral-300">
          Termin realizacji
        </label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-neutral-900">
            Wybierz termin
          </option>
          <option value="urgent" className="bg-neutral-900">
            Pilne (ASAP)
          </option>
          <option value="1_3_months" className="bg-neutral-900">
            1-3 miesiące
          </option>
          <option value="3_6_months" className="bg-neutral-900">
            3-6 miesięcy
          </option>
          <option value="6_plus_months" className="bg-neutral-900">
            Powyżej 6 miesięcy
          </option>
          <option value="flexible" className="bg-neutral-900">
            Elastyczny
          </option>
        </select>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-neutral-300 flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Wiadomość *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          placeholder="Opowiedz nam o swoim projekcie..."
        />
      </div>

      {/* Advanced CAPTCHA */}
      <AdvancedCaptcha onVerify={handleVerify} onError={handleError} mode="auto" />

      {/* Error Messages */}
      <AnimatePresence>
        {(submitError || captchaError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-red-400 text-sm font-medium">{submitError || captchaError}</div>
              {captchaError && (
                <div className="text-red-400/70 text-xs mt-1">
                  Spróbuj ponownie lub odśwież stronę
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isVerified || isSubmitting}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold transition-all
          flex items-center justify-center flex-row gap-2
          ${
            !isVerified || isSubmitting
              ? 'bg-neutral-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-600/80 shadow-lg shadow-primary/20'
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
          <div className="flex items-center flex-row gap-2">
            <Send className="w-5 h-5" />
            Wyślij wiadomość
            {isVerified && trustScore > 0 && (
              <span className="text-xs opacity-70">(Zweryfikowano {trustScore}%)</span>
            )}
          </div>
        )}
      </button>

      {/* Privacy Notice */}
      <div className="text-xs text-neutral-500 text-center pt-2">
        Wysyłając formularz, akceptujesz naszą{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          politykę prywatności
        </Link>{' '}
        i zgadzasz się na przetwarzanie danych.
      </div>
    </motion.form>
  )
}
