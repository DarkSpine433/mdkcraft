'use client'

import { ConfiguratorForm } from '@/components/ConfiguratorForm'
import { Mail, MousePointer2, Phone, ShieldCheck, Zap } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'

// --- KOMPONENT TŁA (Podobny do Cta.tsx) ---
const MouseGlow = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 opacity-30"
      style={{
        background: useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(124, 58, 237, 0.15), transparent 80%)`,
      }}
    />
  )
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#020204] text-white overflow-hidden selection:bg-primary/30">
      <MouseGlow />

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      {/* Side Decorative Text (MDK Style) */}
      <div className="absolute -left-12 top-1/2 -rotate-90 origin-left hidden xl:block opacity-20">
        <span className="text-sm font-mono uppercase tracking-[1em] text-white">
          MDK // ESTABLISHED_2024
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[1px] w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-widest uppercase">
              System Communication
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            ROZPOCZNIJ <br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
              PROJEKT_
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg max-w-xl font-light leading-relaxed"
          >
            Nasz terminal jest otwarty. Prześlij specyfikację projektu, a nasz zespół zintegruje
            Twoją wizję z nowoczesnymi technologiami.
          </motion.p>
        </header>

        <div className="space-y-20">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-3xl"
          >
            <div className="bg-[#050507] rounded-[22px] p-8 md:p-10 border border-white/5">
              <ConfiguratorForm />
            </div>
          </motion.div>

          {/* Info Section */}
          <div className="grid lg:grid-cols-2 gap-16">
            <section className="space-y-6">
              <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                Nodes // Dane Kontaktowe
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Mail,
                    label: 'E-mail',
                    val: 'kontakt@mdkcraft.pl',
                    link: 'mailto:kontakt@mdkcraft.pl',
                  },
                  {
                    icon: Phone,
                    label: 'System Audio',
                    val: '+48 123 456 789',
                    link: 'tel:+48123456789',
                  },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.link}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-500"
                  >
                    <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 group-hover:text-primary transition-colors">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                        {item.label}
                      </p>
                      <p className="text-lg font-medium tracking-tight">{item.val}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Status Section */}
            <div className="p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-primary/5 to-transparent h-fit self-end">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <Zap size={16} className="text-primary" /> System_Status: Online
              </h3>
              <ul className="space-y-4">
                {[
                  'Średni czas odpowiedzi: < 2h',
                  'Zintegrowana wycena AI',
                  'Szyfrowanie end-to-end (AES-256)',
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-neutral-400 font-mono"
                  >
                    <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Badges (Jak w Cta.tsx) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-tighter">
            <ShieldCheck size={14} className="text-primary" /> ENCRYPTED_DATA
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-tighter">
            <Zap size={14} className="text-primary" /> INSTANT_TICKET
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-tighter">
            <MousePointer2 size={14} className="text-primary" /> HUMAN_CENTERED
          </div>
        </motion.div>
      </div>
    </div>
  )
}
