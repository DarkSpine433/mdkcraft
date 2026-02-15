'use client'

import { addTicketMessage } from '@/app/actions/dashboard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Ticket, User } from '@/payload-types'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  ticket: Ticket
  currentUser: User
}

const TicketsRow = (props: Props) => {
  const { ticket, currentUser } = props
  const { messages, priority, status, subject, createdAt } = ticket

  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll do dołu przy otwarciu lub nowej wiadomości
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Wywołanie akcji serwerowej
      await addTicketMessage(String(ticket.id), newMessage)

      setNewMessage('')
      // Odświeżamy dane strony, aby Next.js pobrał nową listę wiadomości z serwera
      router.refresh()
    } catch (error) {
      console.error('Błąd wysyłania:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog key={String(ticket.id)}>
      <DialogTrigger asChild>
        <tr
          className="hover:bg-white/5 transition-colors cursor-pointer group border-b border-white/5"
          role="button"
        >
          <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">
            {subject}
          </td>
          <td className="px-6 py-4">
            <span
              className={`text-[10px] px-2 py-1 rounded-full border uppercase tracking-tighter ${
                status === 'open'
                  ? 'border-green-500/50 text-green-500'
                  : 'border-neutral-500/50 text-neutral-500'
              }`}
            >
              {status === 'open' ? 'OTWARTY' : 'ZAMKNIĘTY'}
            </span>
          </td>
          <td className="px-6 py-4 text-xs font-mono uppercase text-neutral-400">{priority}</td>
          <td className="px-6 py-4 text-xs text-neutral-500 font-mono">
            {new Date(createdAt).toLocaleDateString('pl-PL')}
          </td>
        </tr>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-[#050507] border-white/10 text-white shadow-2xl shadow-primary/20 p-0 overflow-hidden gap-0">
        {/* HEADER */}
        <DialogHeader className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              PROT_ZGŁOSZENIA // {String(ticket.id).slice(-8).toUpperCase()}
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic text-white">
            {ticket.subject}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 font-mono text-xs flex items-center gap-2">
            STATUS: <span className="text-primary animate-pulse">SESJA_AKTYWNA</span>
          </DialogDescription>
        </DialogHeader>

        {/* MESSAGES AREA */}
        <div
          ref={scrollRef}
          className="p-6 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar bg-[url('/grid.svg')] bg-fixed"
        >
          {messages?.map((message, index) => {
            const { content, author, sentAt } = message
            const isClient =
              typeof author === 'string'
                ? author === currentUser?.id
                : (author as User)?.id === currentUser?.id
            const formattedDate = new Date(sentAt ?? Date.now()).toLocaleString('pl-PL')

            return (
              <div
                key={index}
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} group`}
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span
                    className={`text-[9px] font-mono uppercase tracking-widest ${isClient ? 'text-primary' : 'text-neutral-500'}`}
                  >
                    {isClient ? 'Użytkownik_Klient' : 'System_MDK_Core'}
                  </span>
                  <span className="text-[9px] text-neutral-700 font-mono">[{formattedDate}]</span>
                </div>

                <div
                  className={`
                    relative p-4 rounded-2xl text-sm leading-relaxed border transition-all duration-300 max-w-[85%]
                    ${
                      isClient
                        ? 'bg-primary/10 border-primary/20 text-neutral-200 rounded-tr-none'
                        : 'bg-white/5 border-white/10 text-neutral-400 rounded-tl-none group-hover:border-white/20'
                    }
                  `}
                >
                  <div
                    className={`absolute top-0 ${isClient ? 'right-0' : 'left-0'} w-2 h-2 bg-[#050507] -translate-y-px`}
                  />
                  <p className="relative z-10 font-light whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* FOOTER & INPUT */}
        <DialogFooter className="p-6 border-t border-white/10 flex-col sm:flex-col gap-4 bg-[#08080a]">
          <div
            className={`
            w-full flex items-center gap-3 p-2 bg-white/2 border rounded-xl group transition-all duration-500
            ${isSubmitting ? 'border-neutral-800 opacity-50' : 'border-white/5 focus-within:border-primary/50 shadow-inner'}
          `}
          >
            <div className="pl-2">
              <span className="text-primary font-mono text-xs animate-pulse font-bold">
                {isSubmitting ? '○' : '>'}
              </span>
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              placeholder={
                isSubmitting ? 'Przesyłanie pakietów...' : 'Wprowadź polecenie lub wiadomość...'
              }
              className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-neutral-300 placeholder:text-neutral-700 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSubmitting || !newMessage.trim()}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg group/btn transition-all disabled:opacity-0"
            >
              <span className="text-[10px] font-mono text-primary uppercase tracking-tighter flex items-center gap-2">
                {isSubmitting ? 'Procesowanie' : 'Wykonaj_Wyślij'}
                <div
                  className={`w-1 h-3 bg-primary shadow-[0_0_8px_#8b5cf6] ${isSubmitting ? 'animate-spin' : 'animate-bounce'}`}
                />
              </span>
            </button>
          </div>

          {/* STATUS BAR */}
          <div className="w-full flex items-center justify-between text-[9px] font-mono tracking-widest px-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_5px_#10b981]" />
                <span className="text-neutral-500 uppercase">
                  Połączenie: <span className="text-neutral-300">BEZPIECZNE</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                <span className="text-neutral-500 uppercase">
                  Kodowanie: <span className="text-neutral-300">AES_256_V2</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-600">
              <span className="uppercase italic opacity-50">Koniec_Transmisji</span>
              <div className="flex gap-0.5">
                <div className="w-[2px] h-3 bg-neutral-800 animate-[pulse_1.5s_infinite]" />
                <div className="w-[2px] h-3 bg-neutral-800 animate-[pulse_1.5s_infinite_0.2s]" />
                <div className="w-[2px] h-3 bg-primary animate-[pulse_1.5s_infinite_0.4s]" />
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TicketsRow
