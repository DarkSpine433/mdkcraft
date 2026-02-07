'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import MagneticButton from '@/components/ui/magneticBotton'
import { cn } from '@/utilities/cn'
import {
  ArrowRight,
  Mail,
  MessageCircleCode,
  MessageSquare,
  MousePointer2,
  Phone,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react'
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

// --- KOMPONENT 1: MAGNETYCZNA POŚWIATA TŁA ---
const MouseGlowBackground = () => {
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
  }, [])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 opacity-30"
      style={{
        background: useMotionTemplate`
          radial-gradient(
            600px circle at ${springX}px ${springY}px,
            rgba(var(--primary-rgb), 0.15),
            transparent 80%
          )
        `,
      }}
    />
  )
}

// --- KOMPONENT 2: INTERAKTYWNA LITERA (Spójność z Twoim Portfolio) ---
const AnimatedWord = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={cn('inline-flex flex-wrap justify-center', className)}>
      {text.split(' ').map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex mr-3 whitespace-nowrap">
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              whileHover={{ y: -5, color: 'rgb(var(--primary-rgb))' }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="inline-block cursor-default"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

// --- KOMPONENT 4: ALERT DIALOG (Bento-style Contact) ---
export function AlertDialogPopUp() {
  const options = [
    {
      name: 'Messenger',
      icon: <MessageSquare size={20} />,
      link: '#',
      desc: 'Szybki czat',
      color: 'hover:bg-blue-600/20 hover:border-blue-600/50',
    },
    {
      name: 'E-mail',
      icon: <Mail size={20} />,
      link: 'mailto:kontakt@mdkcraft.pl',
      desc: 'Zapytania ofertowe',
      color: 'hover:bg-primary/20 hover:border-primary/50',
    },
    {
      name: 'WhatsApp',
      icon: <Phone size={20} />,
      link: 'tel:+48000000000',
      desc: 'Zadzwoń do nas',
      color: 'hover:bg-emerald-600/20 hover:border-emerald-600/50',
    },
  ]

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative group">
          <MagneticButton icon={<MessageCircleCode className="ml-2 group-hover:rotate-[5deg] transition-transform" />} variant="outline" className="h-16 border-dashed">
            Skontaktuj Się
    
          </MagneticButton>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#0a0a0a] border border-white/10 p-2 rounded-[2rem] max-w-xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <AlertDialogHeader>
            <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-4">
              <Send size={24} />
            </div>
            <AlertDialogTitle className="text-3xl font-bold text-white tracking-tighter">
              Wybierz drogę <span className="text-primary">kontaktu</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500 text-base">
              Jesteśmy dostępni na wielu kanałach. Wybierz ten, który najbardziej Ci odpowiada.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 gap-3 mt-8">
            {options.map((opt, i) => (
              <Link
                key={i}
                href={opt.link}
                className={cn(
                  'group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-300',
                  opt.color,
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-neutral-900 text-white group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">{opt.name}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">{opt.desc}</p>
                  </div>
                </div>
                <ArrowRight className="text-neutral-700 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <AlertDialogFooter className="bg-neutral-900/50 p-4 mt-4">
          <AlertDialogAction className="w-full bg-white text-black hover:bg-primary hover:text-white h-12 rounded-xl font-bold uppercase text-xs tracking-widest">
            Powrót
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// --- GŁÓWNY KOMPONENT: CTA ---
const Cta = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 px-6 overflow-hidden bg-black flex flex-col items-center justify-center"
    >
      {/* 1. INTERACTIVE BACKGROUND ELEMENTS */}
      <MouseGlowBackground />

      {/* Dynamiczne linie w tle (Spójność z TitleHero) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>

      <div className="container relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-[0.3em] uppercase mb-8"
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>Start Your Journey</span>
        </motion.div>

        {/* Headline */}
        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-12 text-white">
          <AnimatedWord text="Nie trać ani chwili!" className="text-primary block mb-4" />
          <span className="block opacity-90">
            Zdobądź przewagę w sieci już teraz, <br className="hidden md:block" />
            niech Twoja firma <span className="italic font-light">rośnie szybciej.</span>
          </span>

          {/* Twoja charakterystyczna linia z TitleHero.tsx */}
          <div className="relative mt-8 w-64 mx-auto">
            <hr className="shadow-2xl shadow-primary w-full border-none h-[0.1rem] bg-primary p-0" />
            <div className="shadow-2xl shadow-primary absolute -top-5 w-full h-6 left-1/2 -translate-x-1/2 bg-primary blur-3xl opacity-40"></div>
          </div>
        </h2>

        {/* Action Group */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-16">
          <div className="relative group">
            {/* Dekoracyjny efekt pod przyciskiem */}
            <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <MagneticButton icon={  <Rocket className="ml-2 size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />} className="min-w-[240px] text-background hover:text-violet-500">
              Zapisz się
            
            </MagneticButton>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2 md:-translate-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neutral-500 ml-2">
              W razie wątpliwości
            </span>
            <AlertDialogPopUp />
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-24 flex flex-wrap justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
        >
          <div className="flex items-center gap-2 text-white text-xs font-mono">
            <ShieldCheck size={16} className="text-primary" /> SECURE CODE
          </div>
          <div className="flex items-center gap-2 text-white text-xs font-mono">
            <Zap size={16} className="text-primary" /> FAST PERFORMANCE
          </div>
          <div className="flex items-center gap-2 text-white text-xs font-mono">
            <MousePointer2 size={16} className="text-primary" /> INTUITIVE UX
          </div>
        </motion.div>
      </div>

      {/* Side Decorative Text (identyczny jak w Twoim pliku Projects.tsx) */}
      <div className="absolute -left-10 bottom-10 rotate-90 origin-left hidden xl:block">
        <span className="text-[100px] font-black text-white/[0.02] select-none uppercase tracking-tighter">
          Contact Now
        </span>
      </div>
    </section>
  )
}

export default Cta
