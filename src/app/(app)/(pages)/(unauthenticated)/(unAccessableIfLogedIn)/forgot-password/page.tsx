import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { RenderParams } from '@/components/RenderParams'
import Link from 'next/link'

export default async function ForgotPasswordPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl mb-4">
            <Link href="/">
              <span className="text-2xl font-black tracking-tighter text-white">MDKcraft</span>
            </Link>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Odzyskiwanie Dostępu</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Podaj swój adres e-mail, aby otrzymać instrukcje zmiany hasła.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <RenderParams />
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-neutral-500 text-xs font-mono uppercase tracking-widest">
          Pamiętasz hasło?{' '}
          <Link href="/login" className="text-primary hover:underline transition-all">
            Wróć doLogowania
          </Link>
        </p>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zresetuj swoje hasło, aby odzyskać dostęp do terminala.',
  openGraph: mergeOpenGraph({
    title: 'Zapomniane hasło',
    url: '/forgot-password',
  }),
  title: 'Zapomniane hasło',
}
