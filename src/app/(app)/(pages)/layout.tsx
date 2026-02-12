// src/app/(app)/layout.tsx
import { AdminBar } from '@/components/AdminBar'
import { ClientLayoutWrapper } from '@/components/ClientLayoutWrapper'
import { Footer } from '@/components/Footer'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ReactNode } from 'react'

// To jest Server Component - może być async!
export default async function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminBar />
      <LivePreviewListener />

      {/* Wrapper kliencki zarządza tylko animacją i stanem paska */}
      <ClientLayoutWrapper footer={<Footer />}>{children}</ClientLayoutWrapper>
    </>
  )
}
