import { getCachedGlobal } from '@/utilities/getGlobals'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { HeaderClient } from './index.client'
import './index.css'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  return <HeaderClient header={header} user={user} />
}
