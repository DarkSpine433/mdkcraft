import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { LogoutPage } from './LogoutPage'

export default async function Logout() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      <LogoutPage />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zostałeś wylogowany z systemu.',
  openGraph: mergeOpenGraph({
    title: 'Wyloguj',
    url: '/logout',
  }),
  title: 'Wyloguj',
}
