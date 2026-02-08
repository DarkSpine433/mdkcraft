'use client'

import { ArrowUpRight, Globe, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import React, { useEffect, useRef } from 'react'
import MagneticButton from '../ui/magneticBotton'

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
          <MagneticButton
            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none select-none bg-transparent hover:bg-transparent hover:text-white"
            margin="mx-0"
            icon={<></>}
          >
            MDK CRAFT
          </MagneticButton>

          {/* TWOJA CHARAKTERYSTYCZNA LINIA Z TitleHero */}
          <div className="relative mt-10 w-full max-w-md">
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
        <span className="text-9xl font-black tracking-tighter text-white">
          EST. {new Date().getFullYear()}
        </span>
      </div>
    </section>
  )
}

export default BrandFooter
