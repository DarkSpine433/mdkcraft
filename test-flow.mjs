async function testFlow() {
  const urlCreate = 'http://127.0.0.1:3000/api/users'
  const urlLogin = 'http://127.0.0.1:3000/api/users/login'
  const email = 'newuser' + Date.now() + '@test.com'
  const password = 'mypassword123'

  console.log('Registering user:', email)
  try {
    const resCreate = await fetch(urlCreate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    console.log('Create Status:', resCreate.status)
    const createData = await resCreate.text()
    console.log('Create Response:', createData.substring(0, 200))

    console.log('\nLogging in...')
    const resLogin = await fetch(urlLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    console.log('Login Status:', resLogin.status)
    const loginData = await resLogin.text()
    console.log('Login Response:', loginData.substring(0, 200))
  } catch (err) {
    console.error(err)
  }
}

testFlow()
