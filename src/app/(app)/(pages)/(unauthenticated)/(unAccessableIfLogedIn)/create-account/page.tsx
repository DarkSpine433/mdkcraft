import type { Metadata } from 'next'

import { AuthBackground } from '@/components/AuthBackground'
import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { Terminal } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Jesteś już zalogowany.')}`)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />
          <Link
            href="/"
            className="inline-flex items-center justify-center p-4 bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-xl mb-6 hover:bg-white/[0.04] hover:-translate-y-1 hover:rotate-3 transition-all duration-500 ease-out group"
          >
            <Terminal className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors duration-500" />
            <span className="ml-3 text-2xl font-black tracking-tighter text-white">MDKcraft</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Inicjalizacja
          </h1>
          <p className="mt-4 text-neutral-400 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] leading-relaxed">
            Stwórz profil bazowy w systemie
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0A0A0A]/60 border border-white/[0.05] backdrop-blur-[60px] shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50" />
          <div className="relative z-10">
            <RenderParams />
            <CreateAccountForm />
          </div>
        </div>

        <div className="mt-8 text-center bg-black/40 backdrop-blur-md py-4 px-6 rounded-3xl border border-white/[0.02] inline-block w-full">
          <p className="text-neutral-500 text-[11px] font-mono uppercase tracking-[0.1em]">
            Posiadasz już dostęp?{' '}
            <Link
              href="/login"
              className="text-white hover:text-purple-400 transition-colors ml-1 font-bold underline decoration-purple-500/30 underline-offset-4 hover:decoration-purple-500"
            >
              ZALOGUJ SIĘ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Załóż konto i rozpocznij cyfrową podróż z aplikacjami MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Rejestracja | MDKcraft',
    url: '/create-account',
  }),
  title: 'Utwórz Profil',
}
