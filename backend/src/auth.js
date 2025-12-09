import jwt from 'jsonwebtoken';
import { query } from './db.js';
import dotenv from 'dotenv';
import { auth as firebaseAuth } from './config/firebase.js';

dotenv.config();

// Verify Firebase ID token and get/create user
export const verifyFirebaseToken = async (idToken, providedName = null) => {
  try {
    console.log('🔍 verifyFirebaseToken called');
    if (!firebaseAuth) {
      console.error('❌ Firebase Admin SDK not initialized');
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    console.log('✅ Firebase Auth available, verifying token...');
    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    console.log('✅ Token verified, UID:', decodedToken.uid);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in database
    let result = await query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [uid]
    );

    let user;

    if (result.rows.length === 0) {
      // Create new user - use provided name, or fallback to token name, or email prefix
      const userName = providedName || name || email.split('@')[0];
      result = await query(
        'INSERT INTO users (name, email, firebase_uid, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [userName, email, uid, 'user']
      );
      user = result.rows[0];
    } else {
      user = result.rows[0];
    }

    return user;
  } catch (error) {
    throw new Error('Invalid Firebase token: ' + error.message);
  }
};

// Generate JWT token (for our API)
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate QR token for booking
export const generateQRToken = (bookingId, userId) => {
  return jwt.sign(
    {
      bookingId,
      userId,
      type: 'qr_checkin',
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

