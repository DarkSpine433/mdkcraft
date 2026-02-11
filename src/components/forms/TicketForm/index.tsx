'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send } from 'lucide-react'

export const TicketForm = () => {
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState('medium')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          priority,
          messages: [{ content: message }],
          status: 'open',
        }),
      })

      if (!response.ok) throw new Error('Nie udało się utworzyć zgłoszenia')

      router.push('/account/dashboard?success=Ticket utworzony pomyślnie')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">Temat</Label>
        <Input
          id="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          placeholder="Np. Błąd na stronie głównej"
          className="bg-white/5 border-white/10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priorytet</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Wybierz priorytet" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0c] border-white/10">
            <SelectItem value="low">Niski</SelectItem>
            <SelectItem value="medium">Średni</SelectItem>
            <SelectItem value="high">Wysoki</SelectItem>
            <SelectItem value="critical">Krytyczny</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Opis problemu</Label>
        <Textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          placeholder="Opisz dokładnie, co się dzieje..."
          className="bg-white/5 border-white/10 min-h-[150px]"
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-primary/80">
        {isSubmitting ? 'Wysyłanie...' : 'Wyślij Zgłoszenie'} <Send size={16} className="ml-2" />
      </Button>
    </form>
  )
}
