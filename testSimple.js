// Test API with curl-like request
const https = require('http');

const userIds = [
  '6005988f06ea6b360cb75747',
  '600a695da6e5b6845906e726'
];

function testGetUser(userId, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 8082,
      path: `/v1/users/${userId}`,
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            statusMessage: res.statusMessage,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            statusMessage: res.statusMessage,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('Testing API endpoint: GET /v1/users/<USER_ID>\n');
  
  // Test without token
  console.log('1. Testing without token:');
  const userId = userIds[0];
  console.log(`   GET http://127.0.0.1:8082/v1/users/${userId}\n`);
  
  try {
    const res = await testGetUser(userId);
    console.log(`   Status: ${res.status} ${res.statusMessage}`);
    console.log(`   Response: ${JSON.stringify(res.body, null, 2)}\n`);
    
    if (res.status === 401) {
      console.log('   ✓ Auth is required (received 401 Unauthorized)\n');
    }
  } catch (error) {
    console.error('   Error:', error.message);
  }

  process.exit(0);
}

run();
