'use client'

import { Button } from '@/components/ui/button'
import { Code, Home, RefreshCw } from 'lucide-react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DiagnosticLog {
  id: string
  text: string
  type: 'info' | 'error' | 'warning' | 'success' | 'system'
  timestamp: string
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"
      />
    </div>
  )
}

const Scanline = () => (
  <motion.div
    initial={{ y: '-100%' }}
    animate={{ y: '200%' }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    className="fixed inset-0 w-full h-[2px] bg-primary/20 blur-[1px] pointer-events-none z-[100] mix-blend-overlay"
  />
)

const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        animate={{
          x: [-2, 2, -1, 0],
          opacity: [0, 0.7, 0],
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute top-0 left-0 text-red-500 -z-10 translate-x-1"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{
          x: [2, -2, 1, 0],
          opacity: [0, 0.7, 0],
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
        className="absolute top-0 left-0 text-cyan-400 -z-10 -translate-x-1"
      >
        {text}
      </motion.span>
    </div>
  )
}

// --- Main Page ---

export default function ErrorPage({ error, reset }: ErrorProps) {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [showDetails, setShowDetails] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 150 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 150 })

  // Auto-retry Logic
  useEffect(() => {
    if (retryCount < 3) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleRetry()
            return 10
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount])

  const handleRetry = () => {
    if (retryCount >= 3) return
    setIsRetrying(true)
    setRetryCount((prev) => prev + 1)

    // Simulate brief delay before actual reset
    setTimeout(() => {
      reset()
      setIsRetrying(false)
      setCountdown(10)
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-primary/30">
      <Scanline />
      <ParticleBackground />

      {/* Interactive Ambient Light */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1] opacity-40"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${cursorX}px ${cursorY}px, rgba(100, 50, 255, 0.1), transparent 80%)`,
        }}
      />

      <main className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        {/* Hero Section */}
        <div className="flex max-w-5xl flex-col lg:flex-row items-center gap-12 mb-16 w-full ">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlitchText
                text="ERROR"
                className="text-7xl md:text-8xl font-black tracking-tighter mb-4"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-neutral-400 max-w-md font-mono text-sm leading-relaxed mb-8"
            >
              Wystąpił nieoczekiwany błąd. System podjął próbę stabilizacji środowiska, jednak
              wymagana jest interwencja ręczna lub automatyczny restart.
            </motion.p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleRetry}
                disabled={retryCount >= 3 || isRetrying}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <RefreshCw
                    className={`w-4 h-4 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
                  />
                  {isRetrying ? 'RESTARTOWANIE...' : `SPRÓBUJ PONOWNIE [${3 - retryCount}]`}
                </span>
              </Button>

              <Link href="/">
                <Button
                  variant="outline"
                  className="h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Powrót do strony głównej
                </Button>
              </Link>
            </div>

            {retryCount < 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest"
              >
                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    key={retryCount}
                    className="h-full bg-primary"
                  />
                </div>
                Automatyczny restart za {countdown}s
              </motion.div>
            )}
          </div>
        </div>

        {/* Diagnostics & Logs */}
        <div className="w-full mx-auto max-w-3xl mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                    <Code size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold uppercase tracking-wider">
                      Szczegóły techniczne
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[10px] text-neutral-500 space-y-2">
                    <div className="p-3 bg-black/40 rounded-lg border border-red-500/10 text-red-400 break-all">
                      {error.message ||
                        'Unknown runtime exception occurred during lifecycle event.'}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
