import type { Metadata } from 'next'

import { AccountForm } from '@/components/forms/AccountForm'
import { Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Zaloguj się, aby uzyskać dostęp do ustawień konta.')}`,
    )
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-8">Ustawienia Konta</h1>
        <AccountForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zarządzaj swoim profilem i zamówieniami w terminalu MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Konto',
    url: '/account',
  }),
  title: 'Konto',
}
