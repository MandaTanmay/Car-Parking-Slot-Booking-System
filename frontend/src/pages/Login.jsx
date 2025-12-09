import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword } from '../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // Check URL parameter to determine if this is register mode
  const mode = searchParams.get('mode');
  const [isSignUp, setIsSignUp] = useState(mode === 'register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth failed:', err);
      let errorMessage = 'Authentication failed. Please try again.';
      
      // Firebase error messages
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setLoading(false);
    } catch (err) {
      console.error('Password reset failed:', err);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const urlError = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">🚗 ParkEasy</h1>
          <p className="text-gray-600">Find and book parking slots instantly</p>
        </div>

        {(error || urlError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Authentication failed. Please try again.'}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={isForgotPassword ? handleForgotPassword : handleEmailAuth} className="space-y-4 mb-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Sign In')}
            </h2>
          </div>

          {isSignUp && !isForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your name"
                required={isSignUp}
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isForgotPassword ? 'Send Reset Email' : (isSignUp ? 'Sign Up' : 'Sign In'))}
          </button>

          <div className="text-center space-y-2">
            {!isForgotPassword && !isSignUp && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-primary-600 hover:text-primary-700 block w-full"
                disabled={loading}
              >
                Forgot Password?
              </button>
            )}
            
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
                disabled={loading}
              >
                Back to Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
                disabled={loading}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            )}
          </div>
        </form>

        {/* Divider */}
        {!isForgotPassword && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
