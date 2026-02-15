import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <div className="relative min-h-screen bg-[#020204] text-white flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl mb-4">
            <Link href="/">
              <span className="text-2xl font-black tracking-tighter text-white">MDKcraft</span>
            </Link>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Inicjalizacja Profilu</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Dołącz do ekosystemu MDKcraft i zacznij budować swoją obecność w sieci.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <RenderParams />
          <CreateAccountForm />
        </div>

        <p className="text-center text-neutral-500 text-xs font-mono uppercase tracking-widest">
          Masz już konto?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Zaloguj Się
          </Link>
        </p>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
