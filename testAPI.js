// Test API endpoints
const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 8082,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAPI() {
  try {
    console.log('=== Testing API ===\n');

    // Register a new user
    console.log('1. Registering a new user...');
    const registerRes = await makeRequest('POST', '/v1/auth/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPass123'
    });
    console.log(`Status: ${registerRes.status}`);
    console.log('Response:', JSON.stringify(registerRes.body, null, 2));

    if (registerRes.status !== 201) {
      console.error('Registration failed!');
      process.exit(1);
    }

    const token = registerRes.body.tokens.access.token;
    const userId = registerRes.body.user._id;

    // Get user details with token
    console.log('\n2. Getting user details with token...');
    const getUserRes = await makeRequest('GET', `/v1/users/${userId}`, null);
    getUserRes.headers.authorization = `Bearer ${token}`;
    
    // Make the request properly with auth header
    const getWithAuth = await new Promise((resolve) => {
      const options = {
        hostname: '127.0.0.1',
        port: 8082,
        path: `/v1/users/${userId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              body: JSON.parse(data)
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              body: data
            });
          }
        });
      });

      req.on('error', (e) => {
        console.error('Request error:', e.message);
        process.exit(1);
      });
      
      req.end();
    });

    console.log(`Status: ${getWithAuth.status}`);
    console.log('Response:', JSON.stringify(getWithAuth.body, null, 2));

    if (getWithAuth.status === 200) {
      console.log('\n✅ API Test Successful!');
    } else {
      console.log('\n❌ API Test Failed!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

testAPI();
