import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the service account JSON file
const serviceAccountPath = resolve('./firebase-service-account.json');
const serviceAccountJson = readFileSync(serviceAccountPath, 'utf8');

// Convert to base64
const base64String = Buffer.from(serviceAccountJson).toString('base64');

console.log('\n=== Firebase Service Account - Base64 Encoded ===\n');
console.log('Copy this value and set it as FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable on Render:\n');
console.log(base64String);
console.log('\n=== Instructions ===');
console.log('1. Go to Render Dashboard → Your Backend Service');
console.log('2. Click "Environment" in the sidebar');
console.log('3. Add new environment variable:');
console.log('   Key: FIREBASE_SERVICE_ACCOUNT_BASE64');
console.log('   Value: (paste the base64 string above)');
console.log('4. Save changes - Render will auto-redeploy');
console.log('\n');
