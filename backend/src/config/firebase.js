import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  let serviceAccount;

  // Production: Use environment variables
  if (process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CERT_URL
    };
    
    console.log('Using Firebase credentials from environment variables');
  } 
  // Alternative: Use base64 encoded service account
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const base64String = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      console.log('Base64 string length:', base64String?.length || 0);
      const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(jsonString);
      console.log('Firebase credentials loaded from base64, project:', serviceAccount.project_id);
    } catch (error) {
      console.error('Error parsing base64 Firebase credentials:', error.message);
      throw error;
    }
  }
  // Development: Use local file
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = resolve(__dirname, '..', '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    
    if (existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      console.log('Using Firebase credentials from local file');
    } else {
      throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
    }
  } else {
    throw new Error('No Firebase credentials configured. Set environment variables or FIREBASE_SERVICE_ACCOUNT_PATH');
  }

  if (!serviceAccount) {
    throw new Error('No valid Firebase credentials found');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
  });
  
  console.log('✅ Firebase Admin initialized successfully with project:', serviceAccount.project_id);
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  console.log('Note: Firebase Admin SDK requires proper credentials to be configured');
}

export const auth = admin.auth();
export default firebaseApp;
