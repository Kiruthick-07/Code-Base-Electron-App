const fetch = require('node-fetch');

async function testBackend() {
  console.log('🧪 Testing DeepSeek-Coder Backend...\n');

  const baseUrl = 'http://localhost:3001';

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }

    // Test 2: Chat endpoint (without Ollama)
    console.log('\n2️⃣ Testing chat endpoint...');
    const chatResponse = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, can you help me with coding?',
        code: 'console.log("Hello World");',
        language: 'javascript'
      }),
    });

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      if (chatData.success) {
        console.log('✅ Chat endpoint working (response received)');
        console.log('📝 Response preview:', chatData.response.substring(0, 100) + '...');
      } else {
        console.log('⚠️ Chat endpoint responded but with error:', chatData.error);
      }
    } else {
      console.log('❌ Chat endpoint failed:', chatResponse.status, chatResponse.statusText);
    }

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   node server.js');
    }
  }

  console.log('\n📋 Test Summary:');
  console.log('   - Backend server should be running on port 3001');
  console.log('   - Ollama should be running on port 11434');
  console.log('   - Model should be pulled: ollama pull deepseek-coder:1.3b');
  console.log('\n🚀 Ready to test the full integration!');
}

// Run the test
testBackend();
