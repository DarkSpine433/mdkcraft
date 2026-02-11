import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { TicketForm } from '@/components/forms/TicketForm'

export default async function NewTicketPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent('/account/tickets/new')}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Nowe Zgłoszenie Wsparcia</h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Opisz swój problem, a nasz zespół zajmie się nim priorytetowo.</p>
      </header>

      <div className="p-8 rounded-2xl bg-[#0a0a0c] border border-white/5">
        <TicketForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Nowy Ticket | MDKcraft',
}
