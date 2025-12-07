// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsuf0bbXJOGZDLm-MA_TmkZerc3GaI8Ak",
  authDomain: "project-c-4b503.firebaseapp.com",
  projectId: "project-c-4b503",
  storageBucket: "project-c-4b503.firebasestorage.app",
  messagingSenderId: "606759559134",
  appId: "1:606759559134:web:67016765f18ee9a648874f",
  measurementId: "G-Z6FGY48QRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics only works in production with HTTPS
let analytics = null;
try {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.log('Analytics not initialized:', error.message);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log('Firebase initialized successfully');

export { app, analytics, auth, googleProvider };
