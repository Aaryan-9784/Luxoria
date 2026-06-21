const fs = require('fs');
const email = `testuser${Date.now()}@example.com`;
const password = 'TestPassword123!';
const baseUrl = 'http://localhost:5000/api/auth';
let logs = '';

function log(msg) {
  logs += msg + '\n';
}

async function runTests() {
  log('--- STARTING AUTHENTICATION TESTS ---');

  // 1. REGISTER
  log(`\n[1] Registering user: ${email}...`);
  const regRes = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Agent',
      email,
      password,
      phone: '1234567890'
    })
  });
  
  const regData = await regRes.json();
  if (!regRes.ok) {
    log('Registration failed: ' + JSON.stringify(regData));
    fs.writeFileSync('test_output.txt', logs);
    return;
  }
  log('✅ Registration successful!');
  log(`User ID: ${regData.data.user._id}, Role: ${regData.data.user.role}`);

  // 2. LOGIN
  log(`\n[2] Logging in with email: ${email}...`);
  const loginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    log('Login failed: ' + JSON.stringify(loginData));
    fs.writeFileSync('test_output.txt', logs);
    return;
  }
  
  const accessToken = loginData.data.accessToken;
  const cookies = loginRes.headers.get('set-cookie');
  log('✅ Login successful!');
  log('Access Token acquired (first 20 chars): ' + accessToken.substring(0, 20) + '...');
  log('Cookies set by server: ' + (cookies ? 'Yes (Refresh Token is present)' : 'No'));

  // 3. GET ME
  log(`\n[3] Testing Protected Route (/me) with Access Token...`);
  const meRes = await fetch(`${baseUrl}/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  const meData = await meRes.json();
  if (!meRes.ok) {
    log('Protected route failed: ' + JSON.stringify(meData));
    fs.writeFileSync('test_output.txt', logs);
    return;
  }
  log('✅ Protected route accessed successfully!');
  log(`Hello, ${meData.data.user.name}!`);

  // 4. REFRESH TOKEN
  log(`\n[4] Testing Token Refresh...`);
  const refreshRes = await fetch(`${baseUrl}/refresh`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookies 
    }
  });

  const refreshData = await refreshRes.json();
  if (!refreshRes.ok) {
    log('Refresh token failed: ' + JSON.stringify(refreshData));
    fs.writeFileSync('test_output.txt', logs);
    return;
  }
  log('✅ Token Refreshed successfully!');
  log('New Access Token acquired (first 20 chars): ' + refreshData.data.accessToken.substring(0, 20) + '...');

  // 5. LOGOUT
  log(`\n[5] Logging out...`);
  const logoutRes = await fetch(`${baseUrl}/logout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookies 
    }
  });
  
  const logoutData = await logoutRes.json();
  if (!logoutRes.ok) {
    log('Logout failed: ' + JSON.stringify(logoutData));
    fs.writeFileSync('test_output.txt', logs);
    return;
  }
  log('✅ Logout successful! Sessions destroyed.');
  
  log('\n--- ALL AUTHENTICATION TESTS PASSED PERFECTLY! ---');
  fs.writeFileSync('test_output.txt', logs);
}

runTests().catch(e => fs.writeFileSync('test_output.txt', 'Error: ' + e.message));
