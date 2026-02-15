import type { ReactNode } from 'react'

import { RenderParams } from '@/components/RenderParams'

export default async function AuthenticatedPagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="container">
        <RenderParams className="" />
      </div>

      <main>{children}</main>
    </>
  )
}
