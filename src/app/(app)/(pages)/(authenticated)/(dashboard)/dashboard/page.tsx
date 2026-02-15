import { getStripeCustomerPortalUrl } from '@/app/actions/stripe'

import { Button } from '@/components/ui/button'
import type { ClientFile, Project, SubscriptionPlan, Ticket } from '@/payload-types'
import { User } from '@/payload-types'
import configPromise from '@payload-config'
import { Box, ExternalLink, FileText, Layout, MessageSquare, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import Projects from './Projects'
import TicketsRow from './TicketsRow'

export default async function DashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = (await payload.auth({ headers })) as { user: User | null }

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent('/account/dashboard')}`)
  }

  // Fetch user projects
  const projects = (await payload.find({
    collection: 'projects',
    user,
    overrideAccess: false,
    where: {
      client: { equals: user.id },
    },
    limit: 2,
    sort: '-createdAt',
  })) as unknown as { docs: Project[]; totalDocs: number }

  // Fetch user tickets
  const tickets = (await payload.find({
    collection: 'tickets',
    user,
    overrideAccess: false,
    where: {
      client: { equals: user.id },
    },
    limit: 3,
    sort: '-createdAt',
  })) as unknown as { docs: Ticket[]; totalDocs: number }

  // Fetch user files
  const files = (await payload.find({
    collection: 'client-files',
    user,
    overrideAccess: false,
    where: {
      client: { equals: user.id },
    },
    limit: 10,
    sort: '-createdAt',
  })) as unknown as { docs: ClientFile[] }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">
            Witaj_Ponownie, {user.name || user.email}!
          </h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
            SYSTEM_MDKCRAFT :: ZARZĄDZANIE_PROJEKTAMI :: STATUS_AKTYWNY
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects/new">
            <Button variant="outline">Nowy Projekt</Button>
          </Link>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="text-primary h-5 w-5" />
            </div>
            <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1 tracking-widest leading-none">
              Plan_Taryfowy
            </div>
            <div className="text-xl font-black tracking-tighter uppercase">
              {(user.activeSubscription as SubscriptionPlan)?.name || 'DEMO_VERSION'}
            </div>
          </div>
          {user.stripeCustomerID && (
            <form
              action={async () => {
                'use server'
                try {
                  const { url } = await getStripeCustomerPortalUrl()
                  redirect(url)
                } catch (err) {
                  console.error(err)
                }
              }}
            >
              <button className="mt-4 text-[9px] font-mono text-primary flex items-center gap-1 hover:underline uppercase text-left tracking-widest font-bold">
                Biling i Subskrypcja <ExternalLink size={10} />
              </button>
            </form>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group backdrop-blur-sm">
          <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
            <Layout className="text-primary h-5 w-5" />
          </div>
          <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1 tracking-widest leading-none">
            Projekty_W_Toku
          </div>
          <div className="text-xl font-black tracking-tighter uppercase">
            {projects.totalDocs} Aktywnych
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group backdrop-blur-sm">
          <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="text-primary h-5 w-5" />
          </div>
          <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1 tracking-widest leading-none">
            Zgłoszenia_Support
          </div>
          <div className="text-xl font-black tracking-tighter uppercase">
            {tickets.totalDocs} Razem
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              <Box size={20} className="text-primary" /> Najnowsze Projekty
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-[10px] font-mono text-primary hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            Zobacz Wszystkie [{projects.totalDocs}]
          </Link>
        </div>

        <div className="grid gap-4">
          {projects.docs.length > 0 ? (
            projects.docs.map((project) => <Projects key={project.id} project={project} />)
          ) : (
            <div className="p-16 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
                System nie wykrył aktywnych projektów.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Files Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              <FileText size={20} className="text-primary" /> Ostatnie_Dokumenty
            </h2>
          </div>
          <Link
            href="/files"
            className="text-[10px] font-mono text-primary hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            Vault_Klienta {'->'}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.docs.length > 0 ? (
            files.docs.map((file) => (
              <a
                key={file.id}
                href={file.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all flex items-center gap-4 group"
              >
                <div className="p-3 rounded-lg bg-black/40 text-neutral-400 group-hover:text-primary transition-colors">
                  <FileText size={18} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold truncate leading-none mb-1">
                    {file.filename}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-mono uppercase truncate tracking-tighter">
                    {file.description || 'Poufny Dokument'}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full p-16 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
                Baza dokumentów jest pusta.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" /> Wsparcie_Techniczne
            </h2>
          </div>
          <Link
            href="/tickets"
            className="text-[10px] font-mono text-primary hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            Pełna_Lista_Zgłoszeń
          </Link>
        </div>

        <div className="bg-[#0a0a0c]/80 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          {tickets.docs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Temat_Zgłoszenia</th>
                    <th className="px-6 py-4">Priorytet</th>
                    <th className="px-6 py-4">Data_Utworzenia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.docs.map((ticket) => (
                    <TicketsRow
                      key={ticket.id + ticket.createdAt + ticket.status}
                      ticket={ticket}
                      currentUser={user}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
                System nie zarejestrował zgłoszeń wsparcia.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Dashboard | MDKcraft',
  description: 'Zarządzaj swoimi projektami i subskrypcjami MDKcraft.',
}
