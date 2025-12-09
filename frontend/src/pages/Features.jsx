import React from 'react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔍',
      title: 'Real-Time Availability',
      description: 'Check parking slot availability in real-time and book instantly without any hassle.'
    },
    {
      icon: '📱',
      title: 'QR Code Check-In',
      description: 'Quick and contactless check-in with QR codes for a seamless parking experience.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'Know exactly what you\'ll pay with our simple ₹50/hour pricing model.'
    },
    {
      icon: '🔔',
      title: 'Instant Notifications',
      description: 'Get real-time updates about your bookings, confirmations, and reminders.'
    },
    {
      icon: '🚗',
      title: 'Multiple Vehicle Support',
      description: 'Park cars, bikes, or electric vehicles with dedicated slot types.'
    },
    {
      icon: '📊',
      title: 'Booking History',
      description: 'Access your complete parking history and download receipts anytime.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options.'
    },
    {
      icon: '⚡',
      title: 'EV Charging Slots',
      description: 'Special slots with electric vehicle charging facilities available.'
    }
  ];

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
          <h1 className="text-5xl font-bold mb-6">Powerful Features</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Everything you need for a seamless parking experience, all in one place.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join ParkEasy today and experience hassle-free parking.
          </p>
          <button
            onClick={() => navigate('/login?mode=register')}
            className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
