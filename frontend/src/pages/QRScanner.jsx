import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';

const QRScanner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [qrToken, setQrToken] = useState(searchParams.get('token') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-fetch if token is in URL
  React.useEffect(() => {
    if (searchParams.get('token')) {
      handleScan();
    }
  }, []);

  const handleScan = async () => {
    if (!qrToken.trim()) {
      setError('Please enter a QR token');
      return;
    }

    setLoading(true);
    setError(null);
    setBooking(null);

    try {
      const response = await api.get(`/api/bookings/qr/view?qrToken=${qrToken}`);
      setBooking(response.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
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

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔲</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Scan QR Code</h1>
          <p className="text-gray-600">View booking details by scanning the QR code</p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter QR Token
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Paste QR token here..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
              <p className="text-primary-100">Booking ID: {booking.id.slice(0, 8)}...</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              {/* Parking Details */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3">🏢 Parking Location</h3>
                <p className="text-gray-700 font-medium">{booking.parking_lot_name}</p>
                <p className="text-sm text-gray-600">{booking.parking_lot_address}</p>
              </div>

              {/* Slot Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Slot Number</p>
                  <p className="text-2xl font-bold text-green-700">{booking.slot_code}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Slot Type</p>
                  <p className="text-xl font-bold text-purple-700 capitalize">{booking.slot_type}</p>
                </div>
              </div>

              {/* Time Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">⏰ Start Time</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(booking.start_time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">⏱️ End Time</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(booking.end_time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-1">🚗 Vehicle Number</p>
                <p className="text-xl font-bold text-gray-800">{booking.vehicle_number}</p>
              </div>

              {/* User Details */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">👤 User Information</h3>
                <p className="text-sm text-gray-700">{booking.user_name}</p>
                <p className="text-sm text-gray-600">{booking.user_email}</p>
              </div>

              {/* Payment Details */}
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-sm text-gray-500">
                      Rate: ₹{booking.hourly_rate}/hour
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{parseFloat(booking.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Booked At */}
              <div className="text-center text-sm text-gray-500">
                Booked on {new Date(booking.created_at).toLocaleString('en-IN', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!booking && !error && (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3">ℹ️ How to Use</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Scan the QR code from your booking confirmation</li>
              <li>• Or paste the QR token in the input field above</li>
              <li>• View complete booking details instantly</li>
              <li>• Share this link with parking attendants for verification</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
