import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

async function run() {
  try {
    const payload = await getPayload({ config })

    const resDawid = await payload.find({
      collection: 'users',
      where: { email: { equals: 'dawidkonopiaty@gmail.com' } },
    })

    if (resDawid.docs.length > 0) {
      const user = resDawid.docs[0]
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: 'asdfasdf',
          loginAttempts: 0,
          // @ts-expect-error internal
          _verified: true,
        },
      })
      console.log(`Updated dawidkonopiaty@gmail.com with password 'asdfasdf'`)
    } else {
      console.log(`User dawidkonopiaty@gmail.com not found`)
    }

    const resTest = await payload.find({
      collection: 'users',
      where: { email: { equals: 'test@test.com' } },
    })

    if (resTest.docs.length > 0) {
      const user = resTest.docs[0]
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: 'asdfasdf',
          loginAttempts: 0,
          // @ts-expect-error internal
          _verified: true,
        },
      })
      console.log(`Updated test@test.com with password 'asdfasdf'`)
    } else {
      await payload.create({
        collection: 'users',
        data: {
          email: 'test@test.com',
          password: 'asdfasdf',
          roles: ['admin', 'customer'],
          // @ts-expect-error internal
          _verified: true,
          loginAttempts: 0,
        },
      })
      console.log(`Created test@test.com with password 'asdfasdf'`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
  process.exit(0)
}

run()
