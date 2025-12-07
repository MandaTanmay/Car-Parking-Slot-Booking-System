import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSlotsByParkingLot, createBooking, getParkingLots } from '../api/bookings';
import { useSocket } from '../hooks/useSocket';
import Navbar from '../components/Navbar';
import SlotCard from '../components/SlotCard';

const ParkingLot = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const [parkingLot, setParkingLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    vehicleNumber: '',
  });

  const { joinParkingLot, leaveParkingLot, onSlotUpdate, offSlotUpdate } = useSocket();

  useEffect(() => {
    fetchData();
    joinParkingLot(lotId);

    // Listen for real-time updates
    const handleSlotUpdate = (data) => {
      console.log('Slot update received:', data);
      fetchSlots();
    };

    onSlotUpdate(handleSlotUpdate);

    return () => {
      leaveParkingLot(lotId);
      offSlotUpdate(handleSlotUpdate);
    };
  }, [lotId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lotsData, slotsData] = await Promise.all([
        getParkingLots(),
        fetchSlots(),
      ]);
      const lot = lotsData.parkingLots.find((l) => l.id === lotId);
      setParkingLot(lot);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    const { startTime, endTime } = bookingData;
    const slotsData = await getSlotsByParkingLot(lotId, startTime, endTime);
    setSlots(slotsData.slots);
    return slotsData;
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
    // Don't reset bookingData here - keep the times user selected in the date pickers
  };

  const handleBooking = async () => {
    try {
      setError(null);
      console.log('=== CREATING BOOKING ===');
      console.log('Selected slot:', selectedSlot);
      console.log('Booking data:', bookingData);
      
      // Convert to full ISO strings with timezone
      const startDate = new Date(bookingData.startTime);
      const endDate = new Date(bookingData.endTime);
      const now = new Date();
      
      console.log('Start date:', startDate.toISOString());
      console.log('End date:', endDate.toISOString());
      console.log('Current time:', now.toISOString());
      
      // Validate dates
      if (startDate < now) {
        const errorMsg = 'Start time must be in the future';
        setError(errorMsg);
        alert('Error: ' + errorMsg);
        return;
      }
      
      if (endDate <= startDate) {
        const errorMsg = 'End time must be after start time';
        setError(errorMsg);
        alert('Error: ' + errorMsg);
        return;
      }
      
      if (!bookingData.vehicleNumber || !bookingData.vehicleNumber.trim()) {
        const errorMsg = 'Vehicle number is required';
        setError(errorMsg);
        alert('Error: ' + errorMsg);
        return;
      }
      
      const bookingPayload = {
        slotId: selectedSlot.id,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        vehicleNumber: bookingData.vehicleNumber.trim(),
      };
      console.log('Sending booking request:', bookingPayload);
      
      const response = await createBooking(bookingPayload);
      console.log('✅ Booking response:', response);

      alert('Booking successful! Your request is pending admin approval.');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Booking error:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create booking';
      setError(errorMsg);
      alert('Error: ' + errorMsg);
    }
  };

  const handleTimeChange = async () => {
    if (bookingData.startTime && bookingData.endTime) {
      await fetchSlots();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Parking Lot Info */}
        {parkingLot && (
          <div className="card mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {parkingLot.name}
            </h1>
            <p className="text-gray-600">{parkingLot.address}</p>
            <div className="mt-4 flex space-x-8">
              <div>
                <p className="text-sm text-gray-500">Total Slots</p>
                <p className="text-2xl font-bold text-primary-600">
                  {parkingLot.total_slots || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Now</p>
                <p className="text-2xl font-bold text-green-600">
                  {slots.filter((s) => s.is_available && s.is_active).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time Filter */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4">Check Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={bookingData.startTime}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) =>
                  setBookingData({ ...bookingData, startTime: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={bookingData.endTime}
                min={bookingData.startTime || new Date().toISOString().slice(0, 16)}
                onChange={(e) =>
                  setBookingData({ ...bookingData, endTime: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleTimeChange} className="btn-primary w-full">
                Check Availability
              </button>
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Available Slots</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onSelect={handleSlotSelect}
                isSelected={selectedSlot?.id === slot.id}
              />
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Confirm Booking</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Slot</p>
                  <p className="text-lg font-semibold">{selectedSlot.slot_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {selectedSlot.slot_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="text-lg font-semibold">
                    {new Date(bookingData.startTime).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="text-lg font-semibold">
                    {new Date(bookingData.endTime).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Vehicle Number *</p>
                  <input
                    type="text"
                    placeholder="e.g., ABC-1234"
                    value={bookingData.vehicleNumber}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, vehicleNumber: e.target.value.toUpperCase() })
                    }
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSlot(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handleBooking} className="btn-primary flex-1">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLot;
