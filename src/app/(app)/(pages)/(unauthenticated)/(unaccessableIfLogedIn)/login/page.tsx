import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import Link from 'next/link'

import { LoginForm } from '@/components/forms/LoginForm'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Jesteś już zalogowany.')}`)
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl mb-4">
            <Link href="/">
              <span className="text-2xl font-black tracking-tighter text-white">MDKcraft</span>
            </Link>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Autoryzacja_Systemu</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Zaloguj się, aby uzyskać dostęp do swojego terminala projektowego.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <RenderParams />
          <LoginForm />
        </div>

        <p className="text-center text-neutral-500 text-xs font-mono uppercase tracking-widest">
          Nie masz konta?{' '}
          <Link href="/create-account" className="text-primary hover:underline transition-all">
            Utwórz_Profil
          </Link>
        </p>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zaloguj się lub utwórz konto, aby rozpocząć współpracę.',
  openGraph: {
    title: 'Logowanie',
    url: '/login',
  },
  title: 'Logowanie',
}
