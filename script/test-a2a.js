// scripts/test-a2a.js
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8080';
const ENDPOINTS = [
  '/a2a/agent/uptimeAgent',
  '/api/agent/uptimeAgent',
  '/api/a2a/agent/uptimeAgent',
  '/agent/uptimeAgent',
  '/api/agents/uptimeAgent/generate',
  '/api/agents/uptimeAgent',
  '/agents/uptimeAgent/generate'
];

async function findWorkingEndpoint() {
  console.log('🔍 Finding correct endpoint...\n');
  
  for (const endpoint of ENDPOINTS) {
    const url = BASE_URL + endpoint;
    try {
      const response = await axios.post(url, {
        messages: [{ role: "user", content: "test" }]
      });
      console.log(`✅ Found working endpoint: ${endpoint}\n`);
      return url;
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.log(`✅ Found working endpoint: ${endpoint} (non-404 response)\n`);
        return url;
      }
      console.log(`❌ ${endpoint} - ${error.response?.status || error.message}`);
    }
  }
  
  throw new Error('No working endpoint found');
}

async function testA2AEndpoint() {
  const TEST_URL = await findWorkingEndpoint();
  
  console.log('🧪 Testing A2A Endpoint:', TEST_URL);
  console.log('─'.repeat(50));

  // Test 1: Valid request
  console.log('\n📋 Test 1: Check Google');
  try {
    const response = await axios.post(TEST_URL, {
      messages: [
        {
          role: "user",
          content: "Check if google.com is up"
        }
      ]
    });

    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.response?.data || error.message);
  }

  // Test 2: Check multiple sites
  console.log('\n📋 Test 2: Check Multiple Sites');
  try {
    const response = await axios.post(TEST_URL, {
      messages: [
        {
          role: "user",
          content: "Check these sites: github.com, stackoverflow.com, npmjs.com"
        }
      ]
    });

    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.response?.data || error.message);
  }

  // Test 3: Invalid request (missing messages)
  console.log('\n📋 Test 3: Invalid Request (should fail gracefully)');
  try {
    const response = await axios.post(TEST_URL, {
      invalidField: "test"
    });

    console.log('⚠️  Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('✅ Correctly rejected:', error.response?.data?.error || error.message);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('🏁 Tests Complete\n');
}

testA2AEndpoint().catch(console.error);