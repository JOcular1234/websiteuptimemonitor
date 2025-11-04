// scripts/test-a2a.js
const axios = require('axios');

const TEST_URL = process.env.TEST_URL || 'http://127.0.0.1:8080/api/a2a';

async function testA2AEndpoint() {
  console.log('🧪 Testing A2A Endpoint:', TEST_URL);
  console.log('─'.repeat(50));

  // Test 1: Valid A2A request
  console.log('\n📋 Test 1: Valid A2A Request');
  try {
    const response = await axios.post(TEST_URL, {
      jsonrpc: "2.0",
      id: "test-123",
      method: "generate",
      params: {
        messages: [
          {
            role: "user",
            content: "Check if google.com is up"
          }
        ]
      }
    });

    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.response?.data || error.message);
  }

  // Test 2: Telex format
  console.log('\n📋 Test 2: Telex Message Format');
  try {
    const response = await axios.post(TEST_URL, {
      jsonrpc: "2.0",
      id: "telex-456",
      params: {
        message: {
          parts: [
            {
              kind: "text",
              text: "Check if github.com is online"
            }
          ]
        }
      }
    });

    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.response?.data || error.message);
  }

  // Test 3: Invalid request (missing jsonrpc)
  console.log('\n📋 Test 3: Invalid Request (should fail gracefully)');
  try {
    const response = await axios.post(TEST_URL, {
      id: "invalid-789",
      params: {
        text: "test"
      }
    });

    console.log('⚠️  Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('✅ Correctly rejected:', error.response?.data || error.message);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('🏁 Tests Complete\n');
}

testA2AEndpoint().catch(console.error);