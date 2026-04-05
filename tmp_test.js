fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name: "TestUser", 
    email: "test_new@example.com", 
    password: "password123", 
    mobile: "9999999999", 
    address: "Test Village", 
    role: "farmer" 
  })
})
.then(async r => {
  const text = await r.text();
  console.log('Status:', r.status);
  console.log('Response:', text);
})
.catch(e => {
  console.error('Fetch Error:', e.message);
});
