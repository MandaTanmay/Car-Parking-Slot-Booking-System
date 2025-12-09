import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-primary-100">Last updated: December 9, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using ParkEasy's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              ParkEasy provides a platform for booking parking slots. By using our service, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service only for lawful purposes</li>
              <li>Respect the minimum booking duration of 1 hour</li>
              <li>Arrive and depart within your booked time slot</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Booking and Payment</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All bookings are subject to availability. Payment terms include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Pricing is ₹50 per hour with a minimum 1-hour booking</li>
              <li>Payment must be made at the time of booking</li>
              <li>Cancellations may be subject to cancellation fees</li>
              <li>No refunds for early departures or no-shows</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cancellation Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Bookings can be cancelled through your dashboard. Cancellation policies may vary based on 
              the timing of cancellation. Please review the specific cancellation terms before confirming 
              your booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Users are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Their vehicle and personal belongings at all times</li>
              <li>Complying with parking lot rules and regulations</li>
              <li>Reporting any issues or damages promptly</li>
              <li>Using designated parking slots only</li>
              <li>Maintaining vehicle insurance as required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              ParkEasy is not liable for any damage, theft, or loss of vehicles or personal property. 
              Users park at their own risk. We recommend maintaining comprehensive vehicle insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Service Modifications</h2>
            <p className="text-gray-600 leading-relaxed">
              ParkEasy reserves the right to modify, suspend, or discontinue any aspect of the service 
              at any time. We will provide notice of significant changes when possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Account Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to terminate or suspend accounts that violate these terms, engage in 
              fraudulent activity, or misuse the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms of Service, please contact us at legal@parkeasy.com
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
