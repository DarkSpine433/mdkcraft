import type { Metadata } from 'next'

import { Notification } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { AlertCircle, Bell, CheckCircle2, Info } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { MarkAsReadButton, NotificationActions } from './NotificationClient'

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const limit = 10

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const notificationsResult = await payload.find({
    collection: 'notifications',
    where: {
      or: [
        {
          recipient: {
            equals: user?.id,
          },
        },
        {
          broadcast: {
            equals: true,
          },
        },
      ],
    },
    sort: '-createdAt',
    limit,
    page: currentPage,
  })

  const notifications = notificationsResult.docs as unknown as Notification[]
  const totalPages = notificationsResult.totalPages

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'win':
        return <CheckCircle2 size={18} className="text-green-500" />
      case 'bonus':
        return <CheckCircle2 size={18} className="text-primary" />
      case 'alert':
        return <AlertCircle size={18} className="text-red-500" />
      default:
        return <Info size={18} className="text-blue-500" />
    }
  }

  const isUnread = (notif: Notification) => {
    if (notif.broadcast) {
      const readBy = (notif.isReadBy as any[])?.map((u) => (typeof u === 'string' ? u : u.id)) || []
      return !readBy.includes(user?.id)
    }
    return !notif.isRead
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="space-y-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Bell className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Ekran_Powiadomień</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Twoje centrum komunikatów systemowych i aktualizacji.
            </p>
          </div>
        </div>

        <NotificationActions />
      </header>

      <section className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-20 rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-white/5 rounded-full mb-4">
              <Bell size={40} className="text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Cisza_Radiowa</h3>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest max-w-xs leading-relaxed">
              Obecnie nie masz żadnych nowych powiadomień. Sprawdź ponownie później.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const unread = isUnread(notif)
            return (
              <div
                key={notif.id}
                className={`p-6 rounded-3xl bg-white/5 border ${
                  unread ? 'border-primary/40 bg-primary/5' : 'border-white/10'
                } backdrop-blur-xl hover:border-primary/60 transition-all flex items-start gap-4 group relative overflow-hidden`}
              >
                {unread && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}

                <div className="mt-1 shrink-0 p-2 bg-white/5 rounded-lg group-hover:bg-primary/5 transition-colors relative">
                  {getIcon(notif.type)}
                  {unread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-sm uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                        {notif.title}
                      </h3>
                      {unread && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary animate-pulse">
                          Nowe
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                        {format(new Date(notif.createdAt), 'HH:mm • dd.MM.yyyy', { locale: pl })}
                      </span>
                      {unread && <MarkAsReadButton id={notif.id} />}
                    </div>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed font-mono uppercase">
                    {notif.message}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Link
            href={`/notifications?page=${currentPage - 1}`}
            className={`p-3 rounded-xl bg-white/5 border border-white/10 transition-all ${
              currentPage <= 1 ? 'opacity-20 pointer-events-none' : 'hover:border-primary/50'
            }`}
          >
            <ChevronLeft size={20} />
          </Link>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/notifications?page=${i + 1}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs border transition-all ${
                  currentPage === i + 1
                    ? 'bg-primary border-primary text-white font-black'
                    : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/30'
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>

          <Link
            href={`/notifications?page=${currentPage + 1}`}
            className={`p-3 rounded-xl bg-white/5 border border-white/10 transition-all ${
              currentPage >= totalPages
                ? 'opacity-20 pointer-events-none'
                : 'hover:border-primary/50'
            }`}
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Centrum powiadomień dla użytkowników MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Powiadomienia',
    url: '/notifications',
  }),
  title: 'Powiadomienia',
}
