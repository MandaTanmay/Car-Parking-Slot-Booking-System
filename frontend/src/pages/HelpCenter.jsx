import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I book a parking slot?",
      answer: "Sign up or log in, select your desired parking lot, choose your start and end time (minimum 1 hour), select an available slot, and confirm your booking with your vehicle number."
    },
    {
      question: "What is the minimum booking duration?",
      answer: "The minimum booking duration is 1 hour. This ensures fair usage and optimal slot allocation for all users."
    },
    {
      question: "How much does parking cost?",
      answer: "Our pricing is simple and transparent - ₹50 per hour. The total cost is automatically calculated based on your selected duration."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking from the Dashboard. Go to your bookings, select the booking you want to cancel, and click the cancel button."
    },
    {
      question: "How do I check in when I arrive?",
      answer: "Use the QR code provided in your booking confirmation. Simply scan it at the parking lot entrance for quick and contactless check-in."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit/debit cards, UPI, and digital wallets for your convenience."
    },
    {
      question: "Can I extend my parking duration?",
      answer: "Currently, you'll need to make a new booking if you need to extend your stay. We're working on adding this feature soon."
    },
    {
      question: "What if I arrive late or leave early?",
      answer: "Please try to arrive and leave within your booked time slot. Late arrivals may result in slot unavailability. Early departures will still be charged for the full booked duration."
    },
    {
      question: "Do you have EV charging facilities?",
      answer: "Yes! We have dedicated EV slots with charging facilities. Look for the 'EV' slot type when booking."
    },
    {
      question: "How do I get a receipt?",
      answer: "After your booking is complete, you can download a PDF receipt from your booking details page. The receipt includes all transaction information."
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
          <h1 className="text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Find answers to common questions and get the support you need.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/contact')}>
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-800 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">Get in touch with our team</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">My Bookings</h3>
            <p className="text-sm text-gray-600">View and manage bookings</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/pricing')}>
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-800 mb-2">Pricing Info</h3>
            <p className="text-sm text-gray-600">Learn about our rates</p>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <summary className="font-semibold text-gray-800 cursor-pointer text-lg">
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-primary-50 p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Still Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions or issues.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
