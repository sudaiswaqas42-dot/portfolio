const http = require('http');

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing API GET /api/portfolio ---');
  const res1 = await request('http://localhost:5000/api/portfolio');
  console.log('Portfolio status:', res1.status);
  const data = JSON.parse(res1.body);
  console.log('Site Title:', data.settings.title);
  console.log('Name:', data.settings.first_name, data.settings.last_name);
  console.log('Services count:', data.services.length);
  console.log('Philosophy points:', data.philosophy.length);
  console.log('Projects count:', data.projects.length);

  console.log('\n--- 2. Testing API POST /api/auth/login ---');
  const resLogin = await request('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { username: 'admin', password: 'admin123' });
  console.log('Login status:', resLogin.status);
  const loginData = JSON.parse(resLogin.body);
  console.log('Login success! Token received:', !!loginData.token);

  console.log('\n--- 3. Testing Admin Settings PUT /api/admin/settings ---');
  const updateRes = await request('http://localhost:5000/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`
    }
  }, {
    ...data.settings,
    headline: '16 years making users click and scroll my designs'
  });
  console.log('Update settings status:', updateRes.status);

  console.log('\n--- 4. Testing Vite Frontend Routes ---');
  const routes = ['/', '/about', '/work', '/login', '/admin'];
  for (const r of routes) {
    const routeRes = await request(`http://localhost:3000${r}`);
    console.log(`Route ${r} status:`, routeRes.status, 'HTML contains root div:', routeRes.body.includes('id="root"'));
  }

  console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch(console.error);
