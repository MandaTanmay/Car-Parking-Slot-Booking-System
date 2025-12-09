import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
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
          <h1 className="text-5xl font-bold mb-6">About ParkEasy</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Making parking simple, fast, and hassle-free for everyone.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            At ParkEasy, we believe that finding parking shouldn't be a stressful experience. 
            Our mission is to revolutionize urban parking by providing a seamless, technology-driven 
            solution that saves time, reduces frustration, and makes parking accessible to everyone.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We're committed to building smart cities by connecting drivers with available parking 
            spaces in real-time, reducing traffic congestion, and contributing to a cleaner environment.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
              <p className="text-gray-600">
                We design our platform to be intuitive and easy to use, ensuring a smooth experience for all users.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly evolve our technology to provide cutting-edge solutions for modern parking challenges.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p className="text-gray-600">
                We ensure our service is dependable, secure, and available whenever you need it.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We promote eco-friendly practices by reducing unnecessary driving and supporting EV charging.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-primary-50 p-8 rounded-xl mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            ParkEasy was born from a simple frustration: spending too much time circling the block 
            looking for parking. Our founders experienced this pain point daily and knew there had 
            to be a better way.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Today, we're proud to serve thousands of users, helping them save time and reduce stress 
            with our smart parking solution. We continue to grow and innovate, always keeping our 
            users' needs at the heart of everything we do.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Us on Our Journey</h2>
          <p className="text-gray-600 mb-6">
            Experience the future of parking today. Sign up and see the difference.
          </p>
          <button
            onClick={() => navigate('/login?mode=register')}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
