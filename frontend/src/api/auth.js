import api from './api';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

// Firebase Google Sign-In
export const loginWithGoogle = async () => {
  try {
    console.log('Starting Google login...');
    
    // Sign in with Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Firebase login successful, user:', user.email);

    // Get Firebase ID token
    const idToken = await user.getIdToken();
    console.log('Got Firebase ID token');

    // Send ID token to backend for verification and JWT generation
    console.log('Sending token to backend for verification...');
    const response = await api.post('/api/auth/firebase/verify', { idToken });
    console.log('Backend verification successful:', response.data);

    // Store JWT token and user info
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('localStorageUpdated'));

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email, password, name) => {
  try {
    // Create user with Firebase
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Send ID token to backend with name
    const response = await api.post('/api/auth/firebase/verify', { 
      idToken,
      name: name || email.split('@')[0]
    });

    // Store JWT token and user info
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('localStorageUpdated'));

    return response.data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Email/Password Sign In
export const loginWithEmail = async (email, password) => {
  try {
    // Sign in with Firebase
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Send ID token to backend for verification and JWT generation
    const response = await api.post('/api/auth/firebase/verify', { idToken });

    // Store JWT token and user info
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('localStorageUpdated'));

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// Logout
export const logout = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);

    // Call backend logout endpoint
    await api.post('/api/auth/logout');

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('localStorageUpdated'));
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local storage even if backend call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Reset Password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

