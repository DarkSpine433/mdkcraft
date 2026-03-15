'use client'

import { confirmNewsletterSubscription } from '@/app/actions/confirmNewsletter'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, Mail, XCircle } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NewsletterConfirmPage() {
  const { token } = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirm = async () => {
      if (!token || typeof token !== 'string') {
        setStatus('error')
        setMessage('Brak prawidłowego tokenu weryfikacyjnego.')
        return
      }

      const result = await confirmNewsletterSubscription(token)
      if (result.success) {
        setStatus('success')
        setMessage(result.message || 'Subskrypcja została potwierdzona!')
      } else {
        setStatus('error')
        setMessage(result.error || 'Wystąpił błąd podczas weryfikacji.')
      }
    }

    confirm()
  }, [token])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-8 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2" />

        <div className="flex justify-center">
          {status === 'loading' && (
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <Mail className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
          {status === 'success' && (
            <div className="p-4 bg-green-500/10 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-500/10 rounded-full">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            Newsletter <span className="text-primary">Status</span>
          </h1>
          <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
            {status === 'loading' ? 'Weryfikacja systemu...' : 'Proces zakończony'}
          </p>
        </div>

        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl font-mono text-xs uppercase tracking-widest leading-relaxed">
          {message || 'Proszę czekać, sprawdzamy autentyczność Twojej prośby...'}
        </div>

        <div className="pt-4">
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/80 h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
          >
            <Link href="/">Powrót do strony głównej</Link>
          </Button>
        </div>

        <p className="text-[10px] text-neutral-600 font-mono uppercase">
          MDKCraft Protocol // Session Secured
        </p>
      </motion.div>
    </div>
  )
}
