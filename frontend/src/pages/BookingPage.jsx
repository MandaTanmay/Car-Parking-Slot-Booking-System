import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetails, cancelBooking } from '../api/bookings';
import Navbar from '../components/Navbar';

const BookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await getBookingDetails(bookingId);
      setBooking(data.booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchBooking();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary-600 hover:text-primary-700 mb-6 flex items-center"
        >
          ← Back to Dashboard
        </button>

        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Parking Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Parking Lot</p>
                  <p className="text-lg font-medium">{booking.parking_lot_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-lg">{booking.parking_lot_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {booking.slot_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot Type</p>
                  <p className="text-lg capitalize">{booking.slot_type}</p>
                </div>
                {booking.vehicle_number && (
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Number</p>
                    <p className="text-xl font-bold text-gray-900">
                      {booking.vehicle_number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Time Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="text-lg font-medium">
                    {formatDateTime(booking.start_time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="text-lg font-medium">
                    {formatDateTime(booking.end_time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p className="text-lg">{formatDateTime(booking.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {booking.qr_code && booking.status !== 'cancelled' && (
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Check-in QR Code
              </h2>
              <div className="flex flex-col items-center">
                <img
                  src={booking.qr_code}
                  alt="QR Code"
                  className="w-64 h-64 border-2 border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-4 text-center max-w-md">
                  Show this QR code at the parking entrance for check-in
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {booking.status === 'booked' && (
            <div className="border-t pt-6 mt-8">
              <button onClick={handleCancelBooking} className="btn-danger w-full">
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
