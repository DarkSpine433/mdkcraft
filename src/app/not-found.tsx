'use client'

import { ArrowLeft, Home } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="relative inline-block group">
      <h1 className="text-8xl md:text-[150px] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-neutral-300 to-neutral-700 relative z-10 select-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
        {text}
      </h1>

      <motion.h1
        className="absolute top-0 left-0 text-8xl md:text-[150px] font-black tracking-tighter text-fuchsia-600 mix-blend-screen opacity-0 z-20 pointer-events-none select-none"
        animate={{
          opacity: [0, 0.8, 0, 0.4, 0],
          x: [0, -4, 0, 5, 0],
          y: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'circInOut',
        }}
      >
        {text}
      </motion.h1>

      <motion.h1
        className="absolute top-0 left-0 text-8xl md:text-[150px] font-black tracking-tighter text-cyan-400 mix-blend-screen opacity-0 z-20 pointer-events-none select-none"
        animate={{
          opacity: [0, 0, 1, 0, 0.3, 0],
          x: [0, 5, -2, 4, 0],
          y: [0, -1, 3, 0, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'backInOut',
          delay: 0.2,
        }}
      >
        {text}
      </motion.h1>
    </div>
  )
}

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col items-center justify-center selection:bg-primary/30 selection:text-white ">
      <main className="container relative z-10 px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={itemVariants}>
            <GlitchText text="404" />
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-2xl mt-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-200">
              Strona nie istnieje
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed ">
              Próba nawiązania połączenia z stroną nie powiodła się. Dokument mógł zostać usunięty,
              przeniesiony.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-4 relative z-30"
          >
            <Button
              asChild
              className="relative overflow-hidden bg-primary text-black hover:bg-primary/90 font-black h-14 px-10 rounded-2xl transition-all duration-500 uppercase tracking-[0.2em] text-[10px] group shadow-[0_0_40px_-5px_rgba(var(--primary-rgb),0.6)] hover:shadow-[0_0_60px_-10px_rgba(var(--primary-rgb),1)] w-full sm:w-auto"
            >
              <Link href="/">
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="flex items-center justify-center gap-2 relative z-10 font-black">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Powrót Do Bazy
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="relative h-14 px-10 rounded-2xl border-white/10 bg-white/3 text-white hover:bg-white/8 hover:border-white/20 transition-all duration-300 backdrop-blur-sm  uppercase tracking-[0.2em] text-[10px] font-bold group w-full sm:w-auto"
            >
              <Link href="/dashboard">
                <span className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
                  Strona główna
                </span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
