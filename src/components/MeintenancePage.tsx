'use client'

import GlowingButton from '@/components/landingpage/GlowingButton' // Upewnij się, że ścieżka jest poprawna
import { ArrowUp, Cog, Construction, Sparkles, Terminal } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import WebAppVersion from './WebAppVersion'

export default function MaintenancePage({
  redirectTo,
  buttonText,
  maintenancePagesDescription,
}: {
  redirectTo: string
  buttonText: string
  maintenancePagesDescription: string
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 overflow-hidden relative font-sans">
      {/* CYBER BACKGROUND DECORATIONS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* TECH IDENTIFIER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-[1px] w-8 bg-violet-500/50" />
          <span className="text-[10px] font-mono text-violet-400 uppercase tracking-[0.3em]">
            System_Status: Maintenance_Mode
          </span>
          <div className="h-[1px] w-8 bg-violet-500/50" />
        </motion.div>

        {/* MAIN ICON ANIMATION */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            {/* Neon Glow */}
            <div className="absolute inset-0 bg-violet-600/30 rounded-[2.5rem] blur-3xl animate-pulse" />

            <div className="relative bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
              <Construction className="h-16 w-16 text-violet-500" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-3 -right-3 bg-violet-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-violet-400/50"
              >
                <Cog className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* TEXT CONTENT */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-full mb-2">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
              Inicjalizacja ulepszeń
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
            REBOOT{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              SYSTEMU
            </span>
          </h1>

          <p className="text-neutral-500 font-mono text-xs md:text-sm max-w-sm mx-auto leading-relaxed border-x border-white/5 py-2">
            {maintenancePagesDescription}
          </p>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-center mt-10"
        >
          <div onClick={() => router.push(redirectTo)}>
            <GlowingButton className=" text-[11px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <ArrowUp className="h-4 w-4" />
                {buttonText}
              </div>
            </GlowingButton>
          </div>

          <div className="mt-8 flex items-center gap-2 text-neutral-600">
            <WebAppVersion
              icon={<Terminal size={12} />}
              className="text-[9px] font-mono tracking-tighter"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
