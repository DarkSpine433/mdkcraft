import { MongoClient } from 'mongodb'

async function run() {
  const url = 'mongodb://127.0.0.1:27017/mdkcraft'
  const client = new MongoClient(url)
  try {
    await client.connect()
    console.log('Connected successfully to MongoDB')
    const db = client.db('mdkcraft')
    const collection = db.collection('users')

    const updateResult = await collection.updateMany(
      { email: { $in: ['dawidkonopiaty@gmail.com', 'test@test.com'] } },
      {
        $set: { loginAttempts: 0, _verified: true },
        $unset: { lockUntil: '' },
      },
    )
    console.log(`Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`)

    const dawid = await collection.findOne({ email: 'dawidkonopiaty@gmail.com' })
    console.log('User dawidkonopiaty@gmail.com state:')
    if (dawid) {
      console.log({
        email: dawid.email,
        loginAttempts: dawid.loginAttempts,
        lockUntil: dawid.lockUntil,
        _verified: dawid._verified,
      })
    } else {
      console.log('Not found')
    }

    const test = await collection.findOne({ email: 'test@test.com' })
    console.log('User test@test.com state:')
    if (test) {
      console.log({
        email: test.email,
        loginAttempts: test.loginAttempts,
        lockUntil: test.lockUntil,
        _verified: test._verified,
      })
    } else {
      console.log('Not found')
    }
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}
run()
