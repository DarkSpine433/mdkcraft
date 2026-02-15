import type { ReactNode } from 'react'

import { ClientLayoutWrapper } from '@/components/ClientLayoutWrapper'
import { RenderParams } from '@/components/RenderParams'

export default async function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayoutWrapper footer={<></>}>
      <div className="container">
        <RenderParams className="" />
      </div>

      {children}
    </ClientLayoutWrapper>
  )
}
