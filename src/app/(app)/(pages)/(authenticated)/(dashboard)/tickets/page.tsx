import type { Ticket } from '@/payload-types'
import { User } from '@/payload-types'
import configPromise from '@payload-config'
import { MessageSquare, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import TicketsRow from '../dashboard/TicketsRow'

export default async function TicketsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = (await payload.auth({ headers })) as { user: User | null }

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent('/tickets')}`)
  }

  // Fetch user tickets
  const tickets = (await payload.find({
    collection: 'tickets',
    user,
    overrideAccess: false,
    where: {
      client: { equals: user.id },
    },
    sort: '-createdAt',
  })) as unknown as { docs: Ticket[] }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Centrum_Wsparcia</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Zarządzaj swoimi zgłoszeniami i komunikuj się z zespołem MDKcraft.
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all text-sm uppercase tracking-wider shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Nowe Zgłoszenie
        </Link>
      </header>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
        <h2 className="text-xl font-black tracking-tight uppercase mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" /> Twoje_Zgłoszenia
        </h2>

        <div className="bg-[#0a0a0c]/50 rounded-2xl border border-white/5 overflow-hidden">
          {tickets.docs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-mono text-neutral-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Temat</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priorytet</th>
                    <th className="px-6 py-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.docs.map((ticket) => (
                    <TicketsRow key={ticket.id} ticket={ticket} currentUser={user!} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
                Brak aktywnych zgłoszeń wsparcia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Zgłoszenia Support | MDKcraft',
  description: 'Zarządzaj swoimi zgłoszeniami wsparcia technicznego.',
}
