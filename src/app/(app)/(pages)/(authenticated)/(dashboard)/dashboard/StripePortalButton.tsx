'use client'

import { getStripeCustomerPortalUrl } from '@/app/actions/stripe'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const StripePortalButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePortal = async () => {
    setIsLoading(true)
    try {
      const { url } = await getStripeCustomerPortalUrl()
      if (url) {
        router.push(url)
      } else {
        throw new Error('No URL returned')
      }
    } catch (error: any) {
      toast.error('Błąd_Bilingu', {
        description:
          error.message || 'Nie udało się otworzyć portalu płatności. Skontaktuj się z supportem.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePortal}
      disabled={isLoading}
      className="mt-4 text-[9px] font-mono text-primary flex items-center gap-1 hover:underline uppercase text-left tracking-widest font-bold disabled:opacity-50"
    >
      {isLoading ? 'Łączenie...' : 'Biling i Subskrypcja'} <ExternalLink size={10} />
    </button>
  )
}
