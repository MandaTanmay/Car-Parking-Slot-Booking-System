import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-3xl">🚗</span>
              <span className="ml-2 text-2xl font-bold text-primary-600">ParkEasy</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Simple & Transparent Pricing</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Pay only for what you use. No hidden fees, no surprises.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-4 border-primary-100">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hourly Rate</h2>
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-6xl font-bold text-primary-600">₹50</span>
              <span className="text-2xl text-gray-500 ml-2">/hour</span>
            </div>
            <p className="text-gray-600 text-lg">Minimum booking: 1 hour</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold text-gray-800">Real-time availability</p>
                <p className="text-gray-600">Check and book slots instantly</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold text-gray-800">QR code check-in</p>
                <p className="text-gray-600">Contactless and quick entry</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold text-gray-800">Booking management</p>
                <p className="text-gray-600">View, modify, or cancel bookings</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold text-gray-800">Digital receipts</p>
                <p className="text-gray-600">Download PDF receipts anytime</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold text-gray-800">24/7 support</p>
                <p className="text-gray-600">Help when you need it</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login?mode=register')}
            className="w-full py-4 bg-primary-600 text-white text-lg rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg"
          >
            Start Parking Now
          </button>
        </div>

        {/* Example Calculations */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Example Costs</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 mb-2">1 Hour</p>
              <p className="text-3xl font-bold text-primary-600">₹50</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 mb-2">3 Hours</p>
              <p className="text-3xl font-bold text-primary-600">₹150</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 mb-2">Full Day (8 Hours)</p>
              <p className="text-3xl font-bold text-primary-600">₹400</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
