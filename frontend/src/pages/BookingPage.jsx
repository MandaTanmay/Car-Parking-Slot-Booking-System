import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetails, cancelBooking } from '../api/bookings';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';

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

  const calculateAmount = () => {
    if (!booking) return 0;
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60)); // Calculate hours
    const hourlyRate = booking.hourly_rate || 50; // Default ₹50 per hour
    return hours * hourlyRate;
  };

  const downloadBooking = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('🚗 ParkEasy - Booking Receipt', 20, 20);
    
    // Add booking details
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.id}`, 20, 40);
    doc.text(`Status: ${booking.status.toUpperCase()}`, 20, 50);
    doc.text('', 20, 60);
    
    // Parking Information
    doc.setFontSize(14);
    doc.text('Parking Information:', 20, 70);
    doc.setFontSize(12);
    doc.text(`Parking Lot: ${booking.parking_lot_name}`, 20, 80);
    doc.text(`Address: ${booking.parking_lot_address}`, 20, 90);
    doc.text(`Slot: ${booking.slot_code} (${booking.slot_type})`, 20, 100);
    doc.text(`Vehicle: ${booking.vehicle_number}`, 20, 110);
    doc.text('', 20, 120);
    
    // Time Details
    doc.setFontSize(14);
    doc.text('Time Details:', 20, 130);
    doc.setFontSize(12);
    doc.text(`Start: ${formatDateTime(booking.start_time)}`, 20, 140);
    doc.text(`End: ${formatDateTime(booking.end_time)}`, 20, 150);
    doc.text(`Booked On: ${formatDateTime(booking.created_at)}`, 20, 160);
    doc.text('', 20, 170);
    
    // Payment Details
    const amount = calculateAmount();
    doc.setFontSize(14);
    doc.text('Payment Details:', 20, 180);
    doc.setFontSize(12);
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
    doc.text(`Duration: ${hours} hour(s)`, 20, 190);
    doc.text(`Rate: ₹${booking.hourly_rate || 50}/hour`, 20, 200);
    doc.setFontSize(16);
    doc.text(`Total Amount: ₹${amount.toFixed(2)}`, 20, 215);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for using ParkEasy!', 20, 270);
    doc.text('For support, contact: support@parkeasy.com', 20, 280);
    
    // Save PDF
    doc.save(`booking-${booking.id}.pdf`);
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

          {/* Payment Details */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Details
            </h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(booking.end_time) - new Date(booking.start_time)) /
                        (1000 * 60 * 60)
                    )}{' '}
                    hour(s)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate per Hour</span>
                  <span className="font-medium">₹{booking.hourly_rate || 50}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{calculateAmount().toFixed(2)}
                  </span>
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
          <div className="border-t pt-6 mt-8 space-y-4">
            <button
              onClick={downloadBooking}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Booking Details
            </button>
            
            {booking.status === 'booked' && (
              <button onClick={handleCancelBooking} className="btn-danger w-full">
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
