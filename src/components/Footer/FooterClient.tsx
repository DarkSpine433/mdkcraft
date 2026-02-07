'use client'

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
import React, { useRef } from 'react'
import MagneticButton from '../ui/magneticBotton'

// --- TYPY ---




// --- KOMPONENT 2: INTERAKTNYWNY LOGOTYP (Spójność z Twoim stylem) ---
const FooterBrand = () => {
  const text = 'MDK craft'
  return (
    <div className="group cursor-default">
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            whileHover={{ y: -8, color: 'rgb(var(--primary-rgb))' }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
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
          {/* KOLUMNA 1: BRANDING */}
          <div className="lg:col-span-5 space-y-8">
            <FooterBrand />
            <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
              Tworzymy cyfrową przyszłość, łącząc estetykę z technologiczną precyzją. Twój sukces w
              sieci zaczyna się tutaj.
            </p>
            <div className="flex  flex-wrap w-fit gap-4">
              {socialLinks.map((social, i) => (
                <MagneticButton
                  key={i}
                  icon={<span></span>}
                  className=" rounded-xl bg-white/5 border border-white/10 text-neutral-400 p-5 "
                >
                  <Link href={social.href}>{social.icon}</Link>
                </MagneticButton>
              ))}
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
              <Link href="#" className="hover:text-primary transition-colors">
                Polityka Prywatności
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
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
