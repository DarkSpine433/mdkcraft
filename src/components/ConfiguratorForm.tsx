'use client'

import { getConfiguratorOptions } from '@/app/actions/getConfiguratorOptions'
import { submitContactForm } from '@/app/actions/submitContact'
import {
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layout,
  MousePointer2,
  Send,
  Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { AdvancedCaptcha, useAdvancedCaptcha } from './Captcha'
import { TerminalInput, TerminalTextarea } from './TerminalInput'
import { Button } from './ui/button'

export const ConfiguratorForm = () => {
  const [step, setStep] = useState(1)
  const [options, setOptions] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [addons, setAddons] = useState<any[]>([])

  const [selections, setSelections] = useState<{
    type: string
    pages: string
    design: string
    features: string[]
    subscription: string
    addons: string[]
    marketing: string[]
  }>({
    type: '',
    pages: '',
    design: '',
    features: [],
    subscription: '',
    addons: [],
    marketing: [],
  })

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { captchaToken, isVerified, handleVerify, handleError } = useAdvancedCaptcha()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConfiguratorOptions()
        setOptions(data.options)
        setPlans(data.plans)
        setAddons(data.addons)
      } catch (err) {
        console.error('Failed to fetch options', err)
      }
    }
    fetchData()
  }, [])

  const totalPrice = useMemo(() => {
    let oneTime = 0
    let recurring = 0

    // One-time costs from options
    const selectedType = options.find((o) => o.value === selections.type)
    if (selectedType) oneTime += selectedType.price

    const selectedPages = options.find((o) => o.value === selections.pages)
    if (selectedPages) oneTime += selectedPages.price

    const selectedDesign = options.find((o) => o.value === selections.design)
    if (selectedDesign) oneTime += selectedDesign.price

    selections.features.forEach((val) => {
      const opt = options.find((o) => o.value === val)
      if (opt) oneTime += opt.price
    })

    selections.marketing.forEach((val) => {
      const opt = options.find((o) => o.value === val)
      if (opt) oneTime += opt.price
    })

    // Recurring costs from plans/addons
    const selectedPlan = plans.find((p) => p.id === selections.subscription)
    if (selectedPlan) recurring += selectedPlan.price

    selections.addons.forEach((id) => {
      const addon = addons.find((a) => a.id === id)
      if (addon) {
        if (addon.type === 'recurring') recurring += addon.price
        else oneTime += addon.price
      }
    })

    return { oneTime, recurring }
  }, [selections, options, plans, addons])

  const handleToggleFeature = (val: string, category: 'features' | 'marketing' | 'addons') => {
    setSelections((prev) => {
      const current = prev[category]
      if (current.includes(val)) {
        return { ...prev, [category]: current.filter((v) => v !== val) }
      } else {
        return { ...prev, [category]: [...current, val] }
      }
    })
  }

  const handleNext = () => setStep((prev) => prev + 1)
  const handleBack = () => setStep((prev) => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isVerified) {
      setSubmitError('Proszę zweryfikować CAPTCHA')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const summary = `
Typ: ${selections.type}
Strony: ${selections.pages}
Design: ${selections.design}
Funkcje: ${selections.features.join(', ')}
Subskrypcja: ${selections.subscription}
Dodatki: ${selections.addons.join(', ')}
Marketing: ${selections.marketing.join(', ')}

Wycena: ${totalPrice.oneTime} PLN + ${totalPrice.recurring} PLN/mc
Wiadomość dodatkowa: ${contactData.message}
      `

      const result = await submitContactForm({
        name: contactData.name,
        email: contactData.email,
        projectType: selections.type || 'other',
        message: summary,
        captchaToken: captchaToken || '',
        phone: '',
        company: '',
        budget: '',
        timeline: '',
      })

      if (result.success) {
        setSubmitSuccess(true)
      } else {
        throw new Error(result.error || 'Błąd wysyłania')
      }
    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="text-center p-10 space-y-6">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold">Wniosek wysłany!</h2>
        <p className="text-neutral-400">
          Nasz zespół przeanalizuje Twoją konfigurację i skontaktuje się z Tobą wkrótce.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary rounded-xl font-bold"
        >
          Zacznij od nowa
        </Button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <div className="flex  items-center mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center ">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${step >= s ? 'bg-primary text-background shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-white/5 text-neutral-500'}`}
              >
                {s}
              </div>
              {s < 4 && (
                <div className={`w-12 h-[2px] ${step > s ? 'bg-primary' : 'bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Layout className="text-primary" /> Typ Projektu & Skala
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {options
                  .filter((o) => o.category === 'type')
                  .map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setSelections((prev) => ({ ...prev, type: o.value }))}
                      className={`p-6 rounded-2xl border text-left transition-all ${selections.type === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="font-bold mb-1">{o.label}</div>
                      <div className="text-xs text-neutral-500">
                        {o.description || 'Profesjonalne rozwiązanie'}
                      </div>
                    </button>
                  ))}
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Ilość Podstron
                </label>
                <div className="flex flex-wrap gap-3">
                  {options
                    .filter((o) => o.category === 'pages')
                    .map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setSelections((prev) => ({ ...prev, pages: o.value }))}
                        className={`px-6 py-3 rounded-xl border transition-all ${selections.pages === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                      >
                        {o.label}
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="text-primary" /> Design & Funkcje
              </h3>

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Poziom Designu
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {options
                    .filter((o) => o.category === 'design')
                    .map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setSelections((prev) => ({ ...prev, design: o.value }))}
                        className={`p-4 rounded-xl border text-center transition-all ${selections.design === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                      >
                        {o.label}
                      </button>
                    ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Funkcje Dodatkowe
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {options
                    .filter((o) => o.category === 'features')
                    .map((o) => (
                      <button
                        key={o.value}
                        onClick={() => handleToggleFeature(o.value, 'features')}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selections.features.includes(o.value) ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span>{o.label}</span>
                        {selections.features.includes(o.value) && (
                          <CheckCircle2 size={16} className="text-primary" />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="text-primary" /> Utrzymanie & Marketing
              </h3>

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Pakiet Subskrypcyjny (Miesięcznie)
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelections((prev) => ({ ...prev, subscription: p.id }))}
                      className={`p-6 rounded-2xl border text-left transition-all ${selections.subscription === p.id ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">{p.name}</span>
                        <span className="text-primary font-mono">{p.price} PLN</span>
                      </div>
                      <div className="text-xs text-neutral-500">{p.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Opcje Marketingowe
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {options
                    .filter((o) => o.category === 'marketing')
                    .map((o) => (
                      <button
                        key={o.value}
                        onClick={() => handleToggleFeature(o.value, 'marketing')}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selections.marketing.includes(o.value) ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span>{o.label}</span>
                        {selections.marketing.includes(o.value) && (
                          <CheckCircle2 size={16} className="text-primary" />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                <Send className="text-primary" /> Dane_Kontaktowe
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <TerminalInput
                  label="Imię i Nazwisko"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="JAN_KOWALSKI"
                />
                <TerminalInput
                  label="Email_Kontaktowy"
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="JAN@MDKCRAFT.PL"
                />
              </div>
              <TerminalTextarea
                label="Dodatkowe_Uwagi / Specyfikacja"
                value={contactData.message}
                onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="WPISZ_DODATKOWE_WYMAGANIA..."
              />

              <AdvancedCaptcha onVerify={handleVerify} onError={handleError} mode="auto" />

              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                  {submitError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-10">
          {step > 1 ? (
            <Button
              variant={'ghost'}
              onClick={handleBack}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} /> Wróć
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={step === 1 && !selections.type}
              className="px-8 py-4 bg-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dalej <ChevronRight size={20} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isVerified || isSubmitting || !contactData.name || !contactData.email}
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'} <Send size={20} />
            </Button>
          )}
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-32 p-8 rounded-3xl bg-white/5 border border-white/10 space-y-8">
          <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-4">
            Twój Koszyk Projektu
          </h4>

          <div className="space-y-4">
            {selections.type && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">
                  Typ: {options.find((o) => o.value === selections.type)?.label}
                </span>
                <span className="font-mono">
                  {options.find((o) => o.value === selections.type)?.price} PLN
                </span>
              </div>
            )}
            {selections.pages && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">
                  Skala: {options.find((o) => o.value === selections.pages)?.label}
                </span>
                <span className="font-mono">
                  {options.find((o) => o.value === selections.pages)?.price} PLN
                </span>
              </div>
            )}
            {selections.design && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">
                  Design: {options.find((o) => o.value === selections.design)?.label}
                </span>
                <span className="font-mono">
                  {options.find((o) => o.value === selections.design)?.price} PLN
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 space-y-2">
            <div className="flex justify-between items-end">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">
                Koszt Jednorazowy
              </div>
              <div className="text-3xl font-black tracking-tighter">{totalPrice.oneTime} PLN</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">
                Subskrypcja Mies.
              </div>
              <div className="text-xl font-bold tracking-tighter text-primary">
                {totalPrice.recurring} PLN
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <MousePointer2 size={16} className="text-primary mt-1" />
            <p className="text-[10px] text-neutral-400 leading-relaxed uppercase font-mono">
              Wycena ma charakter orientacyjny. Ostateczna oferta zostanie przedstawiona po
              konsultacji technicznej.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
