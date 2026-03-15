'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function RedirectCountdown({ seconds = 10 }: { seconds?: number }) {
  const [countdown, setCountdown] = useState(seconds)
  const router = useRouter()

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/')
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <p className="text-sm text-muted-foreground mt-2">
      Przekierowanie na stronę główną za {countdown}{' '}
      {countdown === 1 ? 'sekundę' : countdown < 5 ? 'sekundy' : 'sekund'}
    </p>
  )
}
