// Simple script to check your current IP address
// Run this with: node check-ip.js

import https from 'https';

console.log('🔍 Checking your current IP address...\n');

const options = {
  hostname: 'api.ipify.org',
  port: 443,
  path: '/',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Your current IP address is:', data);
    console.log('\n📋 To whitelist this IP in MongoDB Atlas:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Sign in to your account');
    console.log('3. Click on your cluster');
    console.log('4. Go to "Network Access" in the left sidebar');
    console.log('5. Click "Add IP Address"');
    console.log('6. Enter this IP:', data);
    console.log('7. Click "Confirm"');
    console.log('\n💡 Or for development, you can allow access from anywhere by adding: 0.0.0.0/0');
  });
});

req.on('error', (err) => {
  console.error('❌ Error checking IP address:', err.message);
  console.log('\n💡 You can manually check your IP at: https://whatismyipaddress.com/');
});

req.end(); 