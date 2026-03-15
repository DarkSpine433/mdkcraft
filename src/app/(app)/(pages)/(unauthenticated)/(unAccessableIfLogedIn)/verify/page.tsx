import type { Metadata } from 'next'

import { AuthBackground } from '@/components/AuthBackground'
import { Command, MailCheck } from 'lucide-react'
import Link from 'next/link'

export default async function VerifyWelcome() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
          <Link
            href="/"
            className="inline-flex items-center justify-center p-4 bg-white/2 border border-white/10 rounded-4xl shadow-2xl backdrop-blur-xl mb-6 hover:bg-white/4 hover:scale-110 hover:-rotate-3 transition-all duration-500 ease-out group"
          >
            <Command className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-500" />
            <span className="ml-3 text-2xl font-black tracking-tighter text-white">MDKcraft</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Weryfikacja
          </h1>
          <p className="mt-4 text-neutral-400 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] leading-relaxed">
            sprawdź swoją skrzynkę odbiorczą
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0A0A0A]/60 border border-white/5 backdrop-blur-[60px] shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 right-0 w-125 h-125 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
              <MailCheck className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <p className="text-white text-lg font-bold mb-4">Autoryzacja Oczekuje</p>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              Wysłaliśmy bezpieczny link weryfikacyjny na Twój adres e-mail. Kliknij go, aby
              odblokować pełny dostęp do systemów MDKcraft.
            </p>
            <Link
              href="/login"
              className="text-[10px] font-mono uppercase tracking-widest text-primary hover:text-white transition-colors border border-primary/30 px-6 py-2 rounded-full hover:bg-primary/10"
            >
              Powrót do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Proces weryfikacji konta w systemie MDKcraft.',
  title: 'Czekamy na weryfikację',
}
