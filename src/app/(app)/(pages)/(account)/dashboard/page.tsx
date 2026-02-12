import { getStripeCustomerPortalUrl } from '@/app/actions/stripe'
import type { ClientFile, Project, SubscriptionPlan, Ticket } from '@/payload-types'
import configPromise from '@payload-config'
import { Box, ExternalLink, FileText, Layout, MessageSquare, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function DashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = (await payload.auth({ headers })) as { user: any }

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
    limit: 5,
  })) as unknown as { docs: Project[]; totalDocs: number }

  // Fetch user tickets
  const tickets = (await payload.find({
    collection: 'tickets',
    user,
    overrideAccess: false,
    where: {
      client: { equals: user.id },
    },
    limit: 5,
    sort: '-createdAt',
  })) as unknown as { docs: Ticket[] }

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
    <div className="flex flex-1 flex-col gap-4 p-4">
      <header>
        <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">
          Witaj, {user.name || user.email}!
        </h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Twoje Centrum Dowodzenia MDKcraft
        </p>
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group flex flex-col justify-between">
          <div>
            <Zap className="text-primary mb-4 group-hover:scale-110 transition-transform" />
            <div className="text-sm text-neutral-500 uppercase font-mono mb-1">
              Aktywna Subskrypcja
            </div>
            <div className="text-xl font-bold">
              {(user.activeSubscription as SubscriptionPlan)?.name || 'Brak'}
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
              <button className="mt-4 text-[10px] font-mono text-primary flex items-center gap-1 hover:underline uppercase text-left">
                Zarządzaj płatnościami <ExternalLink size={10} />
              </button>
            </form>
          )}
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
          <Layout className="text-primary mb-4 group-hover:scale-110 transition-transform" />
          <div className="text-sm text-neutral-500 uppercase font-mono mb-1">Projekty</div>
          <div className="text-xl font-bold">{projects.totalDocs} Aktywnych</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
          <MessageSquare className="text-primary mb-4 group-hover:scale-110 transition-transform" />
          <div className="text-sm text-neutral-500 uppercase font-mono mb-1">Otwarte Tickety</div>
          <div className="text-xl font-bold">
            {tickets.docs.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length}{' '}
            Nowych
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
            <Box size={20} className="text-primary" /> Twoje Projekty
          </h2>
          <Link
            href="/kontakt"
            className="text-xs font-mono text-primary hover:underline uppercase"
          >
            Nowy Projekt +
          </Link>
        </div>

        <div className="grid gap-4">
          {projects.docs.length > 0 ? (
            projects.docs.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                  <div>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-xs text-neutral-500 font-mono uppercase">{project.status}</p>
                  </div>
                  <div className="w-full md:w-48 bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="text-sm font-mono">{project.progress}%</div>
                </div>

                {project.activityLog && project.activityLog.length > 0 && (
                  <div className="w-full mt-4 pt-4 border-t border-white/5">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase mb-2">
                      Ostatnia aktywność:
                    </div>
                    <div className="text-sm italic">
                      &quot;{project.activityLog[project.activityLog.length - 1].message}&quot;
                      <span className="text-[10px] text-neutral-600 ml-2">
                        {new Date(
                          project.activityLog[project.activityLog.length - 1].date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl text-neutral-500 italic">
              Brak aktywnych projektów.
            </div>
          )}
        </div>
      </section>

      {/* Files Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
            <FileText size={20} className="text-primary" /> Client Vault (Pliki)
          </h2>
          <span className="text-xs font-mono text-neutral-500 uppercase">
            Szyfrowane Przechowywanie
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.docs.length > 0 ? (
            files.docs.map((file) => (
              <a
                key={file.id}
                href={file.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#0a0a0c] border border-white/5 hover:border-primary/30 transition-all flex items-center gap-4 group"
              >
                <div className="p-3 rounded-lg bg-white/5 text-neutral-400 group-hover:text-primary transition-colors">
                  <FileText size={20} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold truncate">{file.filename}</div>
                  <div className="text-[10px] text-neutral-600 font-mono uppercase truncate">
                    {file.description || 'Dokument Projektowy'}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full p-10 text-center border border-dashed border-white/10 rounded-2xl text-neutral-500 italic">
              Brak udostępnionych plików.
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
            <MessageSquare size={20} className="text-primary" /> Ostatnie Zgłoszenia
          </h2>
          <Link
            href="/tickets/new"
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors uppercase"
          >
            Otwórz Ticket +
          </Link>
        </div>

        <div className="bg-[#0a0a0c] rounded-2xl border border-white/5 overflow-hidden">
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
                    <tr
                      key={ticket.id}
                      className="hover:bg-white/2 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full border ${ticket.status === 'open' ? 'border-green-500/50 text-green-500' : 'border-neutral-500/50 text-neutral-500'}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">{ticket.priority}</td>
                      <td className="px-6 py-4 text-xs text-neutral-500 font-mono">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-neutral-500 italic">Brak zgłoszeń wsparcia.</div>
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
