'use client'

import { ArrowUpRight, Globe, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

// --- KOMPONENT 1: INTERAKTYWNE TŁO CZĄSTECZKOWE (Canvas) ---
const BrandParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let animationFrameId: number

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 2
        this.speedX = Math.random() * 0.5
        this.speedY = Math.random() * 0.5
        this.opacity = Math.random()
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas!.width) this.x = 0
        if (this.x < 0) this.x = canvas!.width
        if (this.y > canvas!.height) this.y = 0
        if (this.y < 0) this.y = canvas!.height
      }
      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})` // Twoje Primary (Violet)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      particles = []
      for (let i = 0; i < 60; i++) particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.update()
        p.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    handleResize()
    animate()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
}

// --- KOMPONENT 2: MAGNETYCZNE LOGO ---
const MagneticBrand = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 100, damping: 10 })
  const springY = useSpring(y, { stiffness: 100, damping: 10 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }
    x.set((clientX - (left + width / 2)) * 0.2)
    y.set((clientY - (top + height / 2)) * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative cursor-pointer group"
    >
      <Link href="/">
        <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none select-none">
          {text.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]"
              style={{ color: char === ' ' ? 'transparent' : 'white' }}
              whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 5 : -5 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h2>
      </Link>

      {/* Dynamiczna poświata pod tekstem */}
      <div className="absolute inset-0 bg-primary blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
    </motion.div>
  )
}

// --- GŁÓWNY KOMPONENT: BRAND FOOTER ---
const BrandFooter = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(clientX - rect.left)
      mouseY.set(clientY - rect.top)
    }
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
      className="relative w-full h-[600px] bg-black overflow-hidden flex flex-col items-center justify-center border-t border-white/5"
    >
      {/* 1. TŁO I CZĄSTECZKI */}
      <BrandParticles />

      {/* 2. MYSZKA - SPOTLIGHT EFFECT (identyczny jak w Twoich GridCards) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* 3. ELEMENTY DEKORACYJNE SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      {/* 4. GŁÓWNA TREŚĆ */}
      <div className="relative z-20 flex flex-col items-center gap-12 w-full max-w-7xl px-6">
        {/* Górny Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-primary font-mono text-[10px] tracking-[0.5em] uppercase"
        >
          <div className="h-[1px] w-12 bg-primary/30" />
          <Sparkles className="animate-pulse" size={14} />
          <span>The Next Generation of Web</span>
          <div className="h-[1px] w-12 bg-primary/30" />
        </motion.div>

        {/* Brand Name */}
        <div className="flex flex-col items-center">
          <MagneticBrand text="MDK CRAFT" />

          {/* TWOJA CHARAKTERYSTYCZNA LINIA Z TitleHero */}
          <div className="relative mt-2 w-full max-w-md">
            <motion.hr
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1, ease: 'circOut' }}
              className="shadow-2xl shadow-primary border-none h-[0.05rem] bg-gradient-to-r from-transparent via-primary to-transparent p-0"
            />
            <div className="shadow-2xl shadow-primary absolute -top-4 w-full h-4 left-1/2 -translate-x-1/2 bg-primary blur-3xl opacity-40"></div>
          </div>
        </div>

        {/* Dolne ikony / Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-10"
        >
          {[
            { icon: <Globe size={18} />, label: 'Global Reach' },
            { icon: <ShieldCheck size={18} />, label: 'Secure Stack' },
            { icon: <Zap size={18} />, label: 'Ultra Fast' },
            { icon: <ArrowUpRight size={18} />, label: 'Scalable' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:text-primary transition-all">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Side Decorative Text */}
      <div className="absolute -right-16 top-1/2 -rotate-90 origin-center opacity-5 pointer-events-none hidden xl:block">
        <span className="text-9xl font-black tracking-tighter text-white">EST. {new Date().getFullYear()}</span>
      </div>
    </section>
  )
}

export default BrandFooter
