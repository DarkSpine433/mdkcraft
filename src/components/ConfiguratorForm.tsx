'use client'

import { getConfiguratorOptions } from '@/app/actions/getConfiguratorOptions'
import { submitContactForm } from '@/app/actions/submitContact'
import { useAuth } from '@/providers/Auth'
import {
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layout,
  MousePointer2,
  RotateCcw,
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
    subpagesCount: string
    design: string
    features: string[]
    subscription: string
    addons: string[]
    marketing: string[]
    extraFeatures: string[]
    brandingStatus: string
    contentProvider: string
    hasDomainHosting: string
  }>({
    type: '',
    subpagesCount: '1',
    design: '',
    features: [],
    subscription: '',
    addons: [],
    marketing: [],
    extraFeatures: [],
    brandingStatus: '',
    contentProvider: '',
    hasDomainHosting: '',
  })

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    currentUrl: '',
    businessDescription: '',
    targetAudience: '',
    mainGoal: '',
    inspirationLinks: '',
    message: '',
    plannedLaunchDate: '',
    budgetRange: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { user } = useAuth()
  const { captchaToken, isVerified, handleVerify, handleError } = useAdvancedCaptcha()

  useEffect(() => {
    if (user) {
      const fullName = [user.name, user.surname].filter(Boolean).join(' ')
      setContactData((prev) => ({
        ...prev,
        name: prev.name || fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        companyName: prev.companyName || user.company || '',
      }))
    }
  }, [user])

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

    // Load persisted state
    const savedStep = localStorage.getItem('mdk_config_step')
    const savedSelections = localStorage.getItem('mdk_config_selections')
    const savedContact = localStorage.getItem('mdk_config_contact')

    if (savedStep) setStep(parseInt(savedStep))
    if (savedSelections) setSelections(JSON.parse(savedSelections))
    if (savedContact) setContactData(JSON.parse(savedContact))
  }, [])

  useEffect(() => {
    localStorage.setItem('mdk_config_step', step.toString())
    localStorage.setItem('mdk_config_selections', JSON.stringify(selections))
    localStorage.setItem('mdk_config_contact', JSON.stringify(contactData))
  }, [step, selections, contactData])

  const handleReset = () => {
    if (
      window.confirm(
        'Czy na pewno chcesz zresetować formularz? Wszystkie postępy zostaną utracone.',
      )
    ) {
      setSelections({
        type: '',
        subpagesCount: '1',
        design: '',
        features: [],
        subscription: '',
        addons: [],
        marketing: [],
        extraFeatures: [],
        brandingStatus: '',
        contentProvider: '',
        hasDomainHosting: '',
      })
      setContactData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        currentUrl: '',
        businessDescription: '',
        targetAudience: '',
        mainGoal: '',
        inspirationLinks: '',
        message: '',
        plannedLaunchDate: '',
        budgetRange: '',
      })
      setStep(1)
      localStorage.removeItem('mdk_config_step')
      localStorage.removeItem('mdk_config_selections')
      localStorage.removeItem('mdk_config_contact')
    }
  }

  const totalPrice = useMemo(() => {
    let oneTime = 0
    let recurring = 0

    // One-time costs from options
    const selectedType = options.find((o) => o.value === selections.type)
    if (selectedType) oneTime += selectedType.price

    const selectedPages = options.find(
      (o) => o.category === 'pages' && o.value === selections.subpagesCount,
    )
    if (selectedPages) oneTime += selectedPages.price

    const selectedDesign = options.find(
      (o) => o.category === 'design' && o.value === selections.design,
    )
    if (selectedDesign) oneTime += selectedDesign.price

    selections.features.forEach((val) => {
      const opt = options.find((o) => o.value === val)
      if (opt) oneTime += opt.price
    })

    selections.extraFeatures.forEach((val) => {
      const opt = options.find((o) => o.value === val)
      if (opt) oneTime += opt.price
    })

    selections.marketing.forEach((val) => {
      const opt = options.find((o) => o.value === val)
      if (opt) oneTime += opt.price
    })

    const selectedContent = options.find(
      (o) => o.category === 'logistics' && o.value === selections.contentProvider,
    )
    if (selectedContent) oneTime += selectedContent.price

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
      const result = await submitContactForm({
        // Osobiste
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,

        // I. Informacje Ogólne
        companyName: contactData.companyName,
        currentUrl: contactData.currentUrl,
        businessDescription: contactData.businessDescription,
        targetAudience: contactData.targetAudience,

        // II. Zakres i Cele
        mainGoal: contactData.mainGoal,
        subpagesCount: selections.subpagesCount,
        extraFeatures: selections.extraFeatures,

        // III. Design i Estetyka
        designLevel: selections.design,
        brandingStatus: selections.brandingStatus,
        inspirationLinks: contactData.inspirationLinks,

        // IV. Logistyka i Treści
        contentProvider: selections.contentProvider,
        hasDomainHosting: selections.hasDomainHosting,
        plannedLaunchDate: contactData.plannedLaunchDate,
        budgetRange: contactData.budgetRange,

        // Systemowe
        projectType: selections.type || 'other',
        budget: contactData.budgetRange || 'not_sure',
        timeline: contactData.plannedLaunchDate || 'flexible',
        message: contactData.message,
        captchaToken: captchaToken || '',
        sessionId: 'configurator',
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
        <div className="flex items-center mb-10 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${step >= s ? 'bg-primary text-background shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-white/5 text-neutral-500'}`}
              >
                {s}
              </div>
              {s < 5 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-white/5'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Layout className="text-primary" /> I. Informacje Ogólne
                </h3>
                <p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                  Nodes // Podstawowe dane projektu
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Przeznaczenie projektu (Typ)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Wizytówka', value: 'business_card' },
                    { label: 'Landing Page', value: 'landing_page' },
                    { label: 'Sklep', value: 'ecommerce' },
                    { label: 'System/Portal', value: 'portal' },
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setSelections((prev) => ({ ...prev, type: o.value }))}
                      className={`p-4 rounded-xl border text-center transition-all ${selections.type === o.value ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-neutral-400'}`}
                    >
                      <span className="text-xs font-bold">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <TerminalInput
                  label="Nazwa firmy / Adres strony"
                  value={contactData.companyName}
                  onChange={(e) =>
                    setContactData((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  placeholder="NP. MDKCRAFT / WWW.MDKCRAFT.PL"
                />
                <TerminalInput
                  label="Adres obecnej strony (jeśli posiadasz)"
                  value={contactData.currentUrl}
                  onChange={(e) =>
                    setContactData((prev) => ({ ...prev, currentUrl: e.target.value }))
                  }
                  placeholder="WWW.TWOJASTRONA.PL"
                />
              </div>

              <TerminalTextarea
                label="Czym zajmuje się firma? (Model biznesowy)"
                value={contactData.businessDescription}
                onChange={(e) =>
                  setContactData((prev) => ({ ...prev, businessDescription: e.target.value }))
                }
                placeholder="KRÓTKI OPIS DZIAŁALNOŚCI..."
              />

              <TerminalTextarea
                label="Kto jest grupą docelową?"
                value={contactData.targetAudience}
                onChange={(e) =>
                  setContactData((prev) => ({ ...prev, targetAudience: e.target.value }))
                }
                placeholder="KLIENT INDYWIDUALNY, BIZNES, WIEK, BRANŻA..."
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="text-primary" /> II. Zakres i Cele
                </h3>
                <p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                  Logic // Cele i funkcjonalność
                </p>
              </div>

              <TerminalTextarea
                label="Jaki jest główny cel strony?"
                value={contactData.mainGoal}
                onChange={(e) => setContactData((prev) => ({ ...prev, mainGoal: e.target.value }))}
                placeholder="NP. SPRZEDAŻ, LEADGEN, WIZERUNEK PREMIUM..."
              />

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Ile podstron planujemy?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['1', '2-5', '5-10', '10+'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelections((prev) => ({ ...prev, subpagesCount: val }))}
                      className={`p-4 rounded-xl border font-mono text-center transition-all ${selections.subpagesCount === val ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-neutral-400'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Funkcje dodatkowe
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Formularz kontaktowy', value: 'contact_form' },
                    { label: 'System rezerwacji / kalendarz', value: 'booking' },
                    { label: 'Wielojęzyczność', value: 'multi_lang' },
                    { label: 'Social Media', value: 'social' },
                    { label: 'Blog / Sekcja aktualności', value: 'blog' },
                    { label: 'Płatności online', value: 'payments' },
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        setSelections((prev) => ({
                          ...prev,
                          extraFeatures: prev.extraFeatures.includes(o.value)
                            ? prev.extraFeatures.filter((v) => v !== o.value)
                            : [...prev.extraFeatures, o.value],
                        }))
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selections.extraFeatures.includes(o.value) ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                    >
                      <span className="text-sm">{o.label}</span>
                      {selections.extraFeatures.includes(o.value) && (
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Calculator className="text-primary" /> III. Design i Estetyka
                </h3>
                <p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                  Aesthetics // Wizualizacja marki
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Poziom designu
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      label: 'PROFIL STANDARD',
                      value: 'standard',
                      desc: 'Skuteczna wizytówka, szybkie wdrożenie.',
                    },
                    {
                      label: 'STRATEGIC DESIGN',
                      value: 'strategic',
                      desc: 'Unikalny projekt UI/UX od podstaw.',
                    },
                    {
                      label: 'EXPERIENCE',
                      value: 'experience',
                      desc: 'Efekt wow, animacje, segment premium.',
                    },
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setSelections((prev) => ({ ...prev, design: o.value }))}
                      className={`p-6 rounded-2xl border text-left transition-all ${selections.design === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="font-bold mb-1 text-sm">{o.label}</div>
                      <div className="text-[10px] text-neutral-500 uppercase leading-tight">
                        {o.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-mono text-neutral-500 uppercase">
                  Identyfikacja wizualna (Logo, księga znaku)
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Posiadam pełną', value: 'full' },
                    { label: 'Tylko Logo', value: 'logo_only' },
                    { label: 'Brak', value: 'none' },
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() =>
                        setSelections((prev) => ({ ...prev, brandingStatus: o.value }))
                      }
                      className={`p-4 rounded-xl border text-center transition-all ${selections.brandingStatus === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <span className="text-xs">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <TerminalTextarea
                label="Linki do stron, które Ci się podobają"
                value={contactData.inspirationLinks}
                onChange={(e) =>
                  setContactData((prev) => ({ ...prev, inspirationLinks: e.target.value }))
                }
                placeholder="WWW.INSPIRACJA1.PL, WWW.INSPIRACJA2.PL..."
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Calculator className="text-primary" /> IV. Logistyka i Treści
                </h3>
                <p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                  Operations // Wdrożenie i budżet
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-mono text-neutral-500 uppercase">
                    Kto dostarcza treści?
                  </label>
                  <div className="space-y-2">
                    {[
                      { label: 'Klient (Ja dostarczam)', value: 'client' },
                      { label: 'Agencja (MDKcraft przygotowuje)', value: 'agency' },
                      { label: 'Mieszane (Wspólnie)', value: 'mixed' },
                    ].map((o) => (
                      <button
                        key={o.value}
                        onClick={() =>
                          setSelections((prev) => ({ ...prev, contentProvider: o.value }))
                        }
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selections.contentProvider === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span className="text-sm">{o.label}</span>
                        {selections.contentProvider === o.value && (
                          <CheckCircle2 size={16} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-mono text-neutral-500 uppercase">
                    Domena i hosting?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Posiadam', value: 'yes' },
                      { label: 'Nie posiadam', value: 'no' },
                    ].map((o) => (
                      <button
                        key={o.value}
                        onClick={() =>
                          setSelections((prev) => ({ ...prev, hasDomainHosting: o.value }))
                        }
                        className={`p-4 rounded-xl border text-center transition-all ${selections.hasDomainHosting === o.value ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span className="text-sm">{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <TerminalInput
                  label="Planowany termin startu"
                  type="date"
                  value={contactData.plannedLaunchDate}
                  onChange={(e) =>
                    setContactData((prev) => ({ ...prev, plannedLaunchDate: e.target.value }))
                  }
                />
                <TerminalInput
                  label="Przybliżony budżet (PLN)"
                  value={contactData.budgetRange}
                  onChange={(e) =>
                    setContactData((prev) => ({ ...prev, budgetRange: e.target.value }))
                  }
                  placeholder="NP. 5000 - 10000"
                />
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                  <Send className="text-primary" /> V. Finalizacja
                </h3>
                <p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                  Submit // Prześlij brief do wyceny
                </p>
              </div>

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

              <TerminalInput
                label="Numer Telefonu"
                value={contactData.phone}
                onChange={(e) => setContactData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+48 000 000 000"
              />

              <TerminalTextarea
                label="Dodatkowe Uwagi"
                value={contactData.message}
                onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="NP. PREFEROWANE GODZINY KONTAKTU..."
              />

              <AdvancedCaptcha onVerify={handleVerify} onError={handleError} mode="auto" />

              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-mono text-xs uppercase tracking-widest">
                  [ERROR]: {submitError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-10">
          <div className="flex gap-4">
            {step > 1 && (
              <Button
                variant={'ghost'}
                onClick={handleBack}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={20} /> Wróć
              </Button>
            )}
            <Button
              variant={'ghost'}
              onClick={handleReset}
              className="flex items-center gap-2 text-neutral-500 hover:text-red-400 transition-colors"
              title="Resetuj formularz"
            >
              <RotateCcw size={18} /> <span className="hidden md:inline">Zacznij od nowa</span>
            </Button>
          </div>

          {step < 5 ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !contactData.businessDescription) ||
                (step === 2 && !contactData.mainGoal) ||
                (step === 3 && !selections.design) ||
                (step === 4 && (!selections.contentProvider || !selections.hasDomainHosting))
              }
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
            {selections.subpagesCount && (
              <div className="flex justify-between text-[10px] uppercase font-mono">
                <span className="text-neutral-500">Podstrony: {selections.subpagesCount}</span>
                <span className="text-neutral-400">
                  {options.find(
                    (o) => o.category === 'pages' && o.value === selections.subpagesCount,
                  )?.price || 0}{' '}
                  PLN
                </span>
              </div>
            )}
            {selections.design && (
              <div className="flex justify-between text-[10px] uppercase font-mono">
                <span className="text-neutral-500">Design: {selections.design}</span>
                <span className="text-neutral-400">
                  {options.find((o) => o.category === 'design' && o.value === selections.design)
                    ?.price || 0}{' '}
                  PLN
                </span>
              </div>
            )}
            {selections.extraFeatures.length > 0 && (
              <div className="flex justify-between text-[10px] uppercase font-mono">
                <span className="text-neutral-500">
                  Funkcje Dodatkowe ({selections.extraFeatures.length})
                </span>
                <span className="text-neutral-400">✓</span>
              </div>
            )}
            {selections.contentProvider && (
              <div className="flex justify-between text-[10px] uppercase font-mono">
                <span className="text-neutral-500">
                  Obsługa Treści: {selections.contentProvider}
                </span>
                <span className="text-neutral-400">
                  {options.find(
                    (o) => o.category === 'logistics' && o.value === selections.contentProvider,
                  )?.price || 0}{' '}
                  PLN
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
