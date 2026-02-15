'use client'

import { createTicket } from '@/app/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function NewTicketPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Proszę wypełnić wszystkie pola.')
      return
    }

    setIsSubmitting(true)
    try {
      await createTicket(formData)
      toast.success('Zgłoszenie zostało utworzone.')
      router.push('/tickets')
      router.refresh()
    } catch (_error) {
      toast.error('Wystąpił błąd podczas tworzenia zgłoszenia.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Powrót do listy
      </Link>

      <header>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">NOWE ZGŁOSZENIE</h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
          Otwórz nowy kanał komunikacji z działem technicznym MDKcraft.
        </p>
      </header>

      <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl rounded-[40px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest ml-1">
                Temat Zgłoszenia
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="KRÓTKI OPIS PROBLEMU..."
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-mono uppercase focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest ml-1">
                Priorytet Operacji
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`
                      h-12 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all
                      ${
                        formData.priority === p
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20'
                      }
                    `}
                  >
                    {p === 'low'
                      ? 'NISKI'
                      : p === 'medium'
                        ? 'ŚREDNI'
                        : p === 'high'
                          ? 'WYSOKI'
                          : 'KRYTYCZNY'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest ml-1">
                Treść Wiadomości
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="OPISZ SZCZEGÓŁY ZGŁOSZENIA..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-sm font-mono uppercase focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all gap-3"
            >
              {isSubmitting ? (
                'INICJALIZACJA...'
              ) : (
                <>
                  <Send size={16} /> Otwórz Zgłoszenie
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* FOOTER INFO */}
      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MessageSquare className="text-primary" size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-white uppercase tracking-tight">
            Wsparcie Techniczne 24/7
          </p>
          <p className="text-neutral-500 text-[10px] font-mono uppercase leading-relaxed">
            Średni czas odpowiedzi dla priorytetu <span className="text-primary">KRYTYCZNY</span> to
            poniżej 2h. Twoje zgłoszenie zostanie przypisane do dedykowanego inżyniera.
          </p>
        </div>
      </div>
    </div>
  )
}
