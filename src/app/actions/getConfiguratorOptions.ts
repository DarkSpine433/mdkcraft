'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'

export async function getConfiguratorOptions() {
  const payload = await getPayload({ config })

  const options = await payload.find({
    collection: 'configurator-options',
    limit: 100,
    pagination: false,
  })

  const plans = await payload.find({
    collection: 'subscription-plans',
    limit: 100,
    pagination: false,
  })

  const addons = await payload.find({
    collection: 'subscription-addons',
    limit: 100,
    pagination: false,
  })

  return {
    options: options.docs,
    plans: plans.docs,
    addons: addons.docs,
  }
}
