import { PricingClient } from '@/components/Pricing/PricingClient'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function PricingPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/projects/new`)
  }
  return <PricingClient />
}

export const metadata: Metadata = {
  description:
    'Skorzystaj z naszego konfiguratora wyceny i otrzymaj profesjonalną ofertę dla swojego projektu.',
  openGraph: mergeOpenGraph({
    title: 'Wycena Projektu | MDKcraft',
    url: '/pricing',
  }),
  title: 'Wycena Projektu',
}
