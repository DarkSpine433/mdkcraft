'use client'

import { markAllNotificationsAsRead, markNotificationAsRead } from '@/app/actions/dashboard'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export const NotificationActions: React.FC = () => {
  const router = useRouter()

  const onReadAll = async () => {
    try {
      await markAllNotificationsAsRead()
      toast.success('Wszystkie powiadomienia zostały oznaczone jako odczytane.')
      window.dispatchEvent(new CustomEvent('notificationsUpdated'))
      router.refresh()
    } catch (_error) {
      toast.error('Błąd podczas aktualizacji.')
    }
  }

  return (
    <button
      onClick={onReadAll}
      className="flex items-center gap-2 px-6 h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest"
    >
      <CheckCircle2 size={14} />
      Oznacz Wszystkie
    </button>
  )
}

export const MarkAsReadButton: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter()

  const onRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await markNotificationAsRead(id)
      window.dispatchEvent(new CustomEvent('notificationsUpdated'))
      router.refresh()
    } catch (_error) {
      toast.error('Błąd.')
    }
  }

  return (
    <button
      onClick={onRead}
      className="p-2 bg-white/5 hover:bg-primary/20 text-neutral-500 hover:text-primary rounded-lg transition-all"
      title="Oznacz jako przeczytane"
    >
      <CheckCircle2 size={16} />
    </button>
  )
}
