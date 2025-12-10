import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-3xl">🚗</span>
              <span className="ml-2 text-2xl font-bold text-primary-600">ParkEasy</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/login?mode=register')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-primary-600"> Parking Spot</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Say goodbye to parking hassles. Book, manage, and pay for parking spaces 
            instantly with ParkEasy - your smart parking solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login?mode=register')}
              className="px-8 py-4 bg-primary-600 text-white text-lg rounded-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-primary-600 text-lg rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-primary-600"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Find Instantly</h3>
                <p className="text-primary-100">Locate available parking spots near you in real-time</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Book Online</h3>
                <p className="text-primary-100">Reserve your spot ahead of time with just a few taps</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
                <p className="text-primary-100">Get instant alerts for booking confirmations, reminders, and real-time slot updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ParkEasy?</h2>
            <p className="text-xl text-gray-600">Everything you need for hassle-free parking</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Availability</h3>
              <p className="text-gray-600">
                See live parking availability and never waste time searching for spots
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Your reservation is confirmed instantly with secure payment processing
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Location</h3>
              <p className="text-gray-600">
                Find parking lots near your destination with integrated maps
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">
                Transparent pricing at just ₹50 per hour - affordable parking without hidden fees
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🕐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Get help anytime with our dedicated customer support team
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking History</h3>
              <p className="text-gray-600">
                Track all your bookings and manage them from your personalized dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Account</h3>
              <p className="text-gray-600">
                Sign up with your email or Google account in seconds. It's quick and free!
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Find & Book</h3>
              <p className="text-gray-600">
                Search for available parking spots near your destination and book instantly
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Park & Pay</h3>
              <p className="text-gray-600">
                Simply arrive at your reserved spot, park your vehicle, and complete the payment securely through our platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Stress-Free Parking?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join thousands of satisfied users who have made parking simple
          </p>
          <button
            onClick={() => navigate('/login?mode=register')}
            className="px-10 py-4 bg-white text-primary-600 text-lg rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </div>


    </div>
  );
};

export default LandingPage;
