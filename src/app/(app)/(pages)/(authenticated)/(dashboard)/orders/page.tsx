import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { OrderItem } from '@/components/OrderItem'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function Orders() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Zaloguj się, aby uzyskać dostęp do swoich zamówień.')}`,
    )
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 0,
      pagination: false,
      user,
      overrideAccess: false,
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Twoje_Zamówienia</h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
          Historia wszystkich Twoich projektów i zakupionych usług.
        </p>
      </header>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
          <div className="py-12 text-center">
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest mb-4">
              Nie masz jeszcze żadnych zamówień.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
            >
              Rozpocznij nowy projekt
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <ul className="flex flex-col gap-6 mb-8">
            {orders?.map((order) => (
              <li key={order.id} className="group">
                <OrderItem order={order} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Twoja historia zamówień w MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Zamówienia',
    url: '/orders',
  }),
  title: 'Zamówienia',
}
