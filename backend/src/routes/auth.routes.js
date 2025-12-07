import express from 'express';
import { verifyFirebaseToken, generateToken, verifyToken } from '../auth.js';
import { query } from '../db.js';

const router = express.Router();

// Firebase authentication endpoint
// Frontend sends Firebase ID token, backend verifies and returns JWT
router.post('/firebase/verify', async (req, res) => {
  try {
    const { idToken, name } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Firebase ID token required' });
    }

    // Verify Firebase token and get/create user
    const user = await verifyFirebaseToken(idToken, name);

    // Generate our own JWT for API access
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);

    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [
      decoded.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

// Logout (client-side handles token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
