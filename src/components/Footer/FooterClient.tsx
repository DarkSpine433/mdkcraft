'use client'

import { subscribeToNewsletter } from '@/app/actions/subscribeNewsletter'
import {
  ArrowUpRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MousePointer2,
  Phone,
  Sparkles,
} from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { AdvancedCaptcha, useAdvancedCaptcha } from '../Captcha'
import { Logo } from '../Logo/Logo'
import { Button } from '../ui/button'
import MagneticButton from '../ui/magneticBotton'

// --- TYPY ---

const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { captchaToken, isVerified, handleVerify, handleError } = useAdvancedCaptcha()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isVerified) return
    setStatus('loading')

    try {
      const result = await subscribeToNewsletter({
        email,
        captchaToken: captchaToken || '',
        source: 'homepage_footer',
      })
      if (result.success) {
        setStatus('success')
        setMessage(result.message || 'Zapisano!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(result.error || 'Błąd')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Wystąpił błąd')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="email"
          required
          placeholder="TWÓJ_EMAIL@"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
        />
        <Button
          disabled={status === 'loading' || !isVerified}
          className="absolute right-2 top-1/2 -translate-y-1/2   px-4 rounded-lg text-xs font-bold transition-all disabled:opacity-50 "
        >
          {status === 'loading' ? '...' : 'Zapisz się'}
        </Button>
      </div>

      {!isVerified && (
        <div className="scale-75 origin-left">
          <AdvancedCaptcha onVerify={handleVerify} onError={handleError} mode="auto" />
        </div>
      )}

      {status === 'success' && (
        <p className="text-[10px] font-mono text-green-500 uppercase">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-[10px] font-mono text-red-500 uppercase">{message}</p>
      )}
    </form>
  )
}

// --- KOMPONENT 2: INTERAKTNYWNY LOGOTYP (Spójność z Twoim stylem) ---
const FooterBrand = () => {
  const text = 'MDKcraft'
  return (
    <div className="group cursor-default space-y-4">
      <MagneticButton
        margin="mx-0"
        icon={<Logo />}
        className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl"
      >
        <></>
      </MagneticButton>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
        {text.split('').map((char, i) =>
          char === ' ' ? (
            '\u00A0'
          ) : (
            <motion.span
              key={i}
              whileHover={{ y: -8, color: '#8b5cf6' }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ),
        )}
      </h2>
      <div className="relative mt-2 w-full max-w-[200px]">
        <hr className="shadow-2xl shadow-primary w-full border-none h-[0.1rem] bg-primary p-0" />
        <div className="shadow-2xl shadow-primary absolute -top-4 w-full h-4 left-1/2 -translate-x-1/2 bg-primary blur-3xl opacity-50"></div>
      </div>
    </div>
  )
}

// --- GŁÓWNY KOMPONENT: FOOTER ---
export default function FooterClient() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const containerRef = useRef<HTMLElement>(null)
  const currentYear = new Date().getFullYear()

  // Track mouse for global glow effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
  }

  const navLinks = [
    { label: 'Strona Główna', href: '/' },
    { label: 'O nas', href: '#about' },
    { label: 'Oferta', href: '#services' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Kontakt', href: '#contact' },
  ]

  const socialLinks = [
    { icon: <Instagram size={20} />, href: '#' },
    { icon: <Facebook size={20} />, href: '#' },
    { icon: <Linkedin size={20} />, href: '#' },
    { icon: <Github size={20} />, href: '#' },
  ]

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-black pt-32 pb-12 overflow-hidden border-t border-white/5"
    >
      {/* 1. BACKGROUND ENGINE */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow Follower */}
        <motion.div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(var(--primary-rgb), 0.15),
                transparent 80%
              )
            `,
          }}
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          {/* KOLUMNA 1: BRANDING & NEWSLETTER */}
          <div className="lg:col-span-5 space-y-8">
            <FooterBrand />
            <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
              Tworzymy cyfrową przyszłość, łącząc estetykę z technologiczną precyzją. Twój sukces w
              sieci zaczyna się tutaj.
            </p>

            <div className="pt-8 space-y-4 max-w-sm">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">
                Newsletter_System
              </h4>
              <NewsletterForm />
            </div>
          </div>

          {/* KOLUMNA 2: MENU */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-8 flex items-center gap-2">
              <Sparkles size={12} /> Nawigacja
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white flex items-center group text-lg transition-all"
                  >
                    <ArrowUpRight
                      size={14}
                      className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLUMNA 3: KONTAKT BENTO-STYLE */}
          <div className="lg:col-span-4">
            <h4 className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-8">
              Kontakt
            </h4>
            <div className="grid gap-4">
              <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/20 transition-colors group">
                <div className="flex items-center gap-4 text-neutral-400 group-hover:text-white transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Mail size={18} />
                  </div>
                  <span>kontakt@mdkcraft.pl</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/20 transition-colors group">
                <div className="flex items-center gap-4 text-neutral-400 group-hover:text-white transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Phone size={18} />
                  </div>
                  <span>+48 123 456 789</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/20 transition-colors group">
                <div className="flex items-center gap-4 text-neutral-400 group-hover:text-white transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <MapPin size={18} />
                  </div>
                  <span>Łódź, Polska</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-neutral-600 font-mono text-[10px] tracking-widest uppercase">
              © {currentYear} MDK CRAFT
            </span>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="flex gap-6 text-[10px] font-mono tracking-widest uppercase text-neutral-500">
              <Link
                href="polityka-prywatności"
                className="hover:text-primary transition-colors"
                target="_blank"
              >
                Polityka Prywatności
              </Link>
              <Link
                href="regulamin"
                className="hover:text-primary transition-colors"
                target="_blank"
              >
                Regulamin
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              Hover to interact
            </span>
            <MousePointer2 size={12} className="text-primary animate-bounce" />
          </div>
        </div>
      </div>

      {/* Side Label (Spójność z Projects.tsx) */}
      <div className="absolute -left-16 bottom-10 rotate-90 origin-center opacity-[0.03] select-none pointer-events-none hidden xl:block">
        <span className="text-9xl font-black text-white uppercase tracking-tighter">
          Crafting Digital
        </span>
      </div>
    </footer>
  )
}
