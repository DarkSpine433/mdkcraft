import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminBar />
      <LivePreviewListener />

      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
