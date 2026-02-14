import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load env vars before importing anything else that might use them
config({ path: path.resolve(dirname, '../../.env') })

const start = async () => {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('@payload-config')
  const { seed } = await import('@/endpoints/seed')

  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Starting standalone seed...')

  try {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    let user = users.docs[0]

    if (!user) {
      payload.logger.info('No user found, creating temp admin for seeding context...')
      user = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'password',
          roles: ['admin'],
        },
      })
    }

    const { createLocalReq } = await import('payload')

    const req = await createLocalReq({ user }, payload)

    await seed({ payload, req })

    payload.logger.info('Standalone seed completed successfully.')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed', err)
    process.exit(1)
  }
}

start()
