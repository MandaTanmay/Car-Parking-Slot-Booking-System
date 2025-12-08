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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header with background
    doc.setFillColor(37, 99, 235); // Primary blue
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ParkEasy', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Parking Booking Receipt', pageWidth / 2, 32, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    let yPos = 60;
    
    // Booking Information Box
    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(15, yPos - 5, pageWidth - 30, 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING ID:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.id.substring(0, 18) + '...', 50, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('STATUS:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const statusText = booking.status.toUpperCase();
    doc.setTextColor(34, 197, 94); // Green for active status
    doc.text(statusText, 50, yPos);
    doc.setTextColor(0, 0, 0);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKED ON:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(booking.created_at).toLocaleDateString(), 50, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.vehicle_number, 50, yPos);
    
    yPos += 20;
    
    // Parking Location
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PARKING LOCATION', 20, yPos);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 2, 80, yPos + 2);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.parking_lot_name, 20, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const addressLines = doc.splitTextToSize(booking.parking_lot_address, pageWidth - 40);
    doc.text(addressLines, 20, yPos);
    
    yPos += (addressLines.length * 5) + 10;
    
    // Slot Information
    doc.setFillColor(37, 99, 235);
    doc.rect(20, yPos - 5, 40, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.slot_code, 40, yPos + 10, { align: 'center' });
    doc.setFontSize(9);
    doc.text(booking.slot_type.toUpperCase(), 40, yPos + 18, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    yPos += 40;
    
    // Parking Duration
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PARKING DURATION', 20, yPos);
    doc.line(20, yPos + 2, 90, yPos + 2);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.text('Check-in:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDateTime(booking.start_time), 60, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Check-out:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDateTime(booking.end_time), 60, yPos);
    
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
    const amount = calculateAmount();
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Duration:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${hours} hour(s)`, 60, yPos);
    
    yPos += 20;
    
    // Payment Summary Box
    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos - 5, pageWidth - 30, 30, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(15, yPos - 5, pageWidth - 30, 30);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PAYMENT SUMMARY', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Hourly Rate:', 20, yPos);
    doc.text(`₹${booking.hourly_rate || 50}/hour`, pageWidth - 50, yPos);
    
    yPos += 8;
    doc.text('Duration:', 20, yPos);
    doc.text(`${hours} hour(s)`, pageWidth - 50, yPos);
    
    yPos += 15;
    
    // Total Amount - Highlighted
    doc.setFillColor(37, 99, 235);
    doc.rect(15, yPos - 8, pageWidth - 30, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL AMOUNT:', 20, yPos);
    doc.text(`₹${amount.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    
    // Footer
    yPos = pageHeight - 30;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing ParkEasy!', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    doc.text('For support: support@parkeasy.com | +91-1800-PARKING', pageWidth / 2, yPos, { align: 'center' });
    
    // Save PDF
    doc.save(`ParkEasy-Booking-${booking.slot_code}-${new Date().getTime()}.pdf`);
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
