import type { Metadata } from 'next'

import { AuthBackground } from '@/components/AuthBackground'
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'
import { RenderParams } from '@/components/RenderParams'
import { Command } from 'lucide-react'
import Link from 'next/link'

export default async function ResetPassword({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

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
            Nowy Klucz
          </h1>
          <p className="mt-4 text-neutral-400 font-mono text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed">
            zdefiniuj nową sygnaturę dostępu
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0A0A0A]/60 border border-white/5 backdrop-blur-[60px] shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 right-0 w-125 h-125 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
          <div className="relative z-10">
            <RenderParams />
            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zdefinuj nową sygnaturę dostępu (hasło) do swojego konta MDKcraft.',
  openGraph: {
    title: 'Nowy Klucz | MDKcraft',
    url: '/forgot-password',
  },
  title: 'Nowe Hasło',
}
