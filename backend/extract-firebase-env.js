import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Helper script to extract Firebase credentials for deployment
 * Run this locally to get the values needed for production environment variables
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ firebase-service-account.json not found!');
  console.log('Make sure the file exists in the backend directory.');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  console.log('\n🔐 Firebase Environment Variables for Production\n');
  console.log('Copy these to your hosting platform (Render, Railway, etc.):\n');
  console.log('='.repeat(70));
  
  console.log('\nFIREBASE_PROJECT_ID=' + serviceAccount.project_id);
  console.log('FIREBASE_PRIVATE_KEY_ID=' + serviceAccount.private_key_id);
  console.log('FIREBASE_CLIENT_EMAIL=' + serviceAccount.client_email);
  console.log('FIREBASE_CLIENT_ID=' + serviceAccount.client_id);
  console.log('FIREBASE_CERT_URL=' + serviceAccount.client_x509_cert_url);
  
  console.log('\n⚠️  FIREBASE_PRIVATE_KEY (copy exactly as shown, including quotes):');
  console.log('FIREBASE_PRIVATE_KEY="' + serviceAccount.private_key + '"');
  
  console.log('\n' + '='.repeat(70));
  
  // Option 2: Base64 encoding
  console.log('\n📦 Alternative: Base64 Encoded (Single Variable)\n');
  console.log('If your platform prefers a single variable, use this:\n');
  const base64 = Buffer.from(JSON.stringify(serviceAccount)).toString('base64');
  console.log('FIREBASE_SERVICE_ACCOUNT_BASE64=' + base64);
  
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Done! Choose Option 1 (individual variables) or Option 2 (base64)');
  console.log('See DEPLOYMENT-FIREBASE.md for detailed instructions.\n');

} catch (error) {
  console.error('❌ Error reading firebase-service-account.json:', error.message);
  process.exit(1);
}
