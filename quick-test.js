#!/usr/bin/env node

// Test endpoints with no auth
const http = require('http');

function makeRequest(path, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 8082,
      path: path,
      method: 'GET',
      headers: {}
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          resolve({ status: res.statusCode, body });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function test() {
  try {
    console.log('Testing: GET /v1/users/6005988f06ea6b360cb75747\n');
    const res = await makeRequest('/v1/users/6005988f06ea6b360cb75747');
    console.log(`HTTP Status: ${res.status}`);
    console.log('Response:', JSON.stringify(res.body, null, 2));
    
    if (res.status === 401) {
      console.log('\n✓ API requires authentication (401 Unauthorized)');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
