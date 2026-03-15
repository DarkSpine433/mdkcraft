import fetch from 'node-fetch';

async function testLogin() {
  const url = 'http://localhost:3000/api/users/login';
  console.log('Sending login request to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'asdfasdf' })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}
testLogin();
