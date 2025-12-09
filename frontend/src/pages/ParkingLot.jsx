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

      // Check minimum booking duration (1 hour)
      const durationMs = endDate - startDate;
      const durationHours = durationMs / (1000 * 60 * 60);
      
      if (durationHours < 1) {
        const errorMsg = 'Minimum parking time is 1 hour';
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
      // Validate minimum 1 hour duration
      const startDate = new Date(bookingData.startTime);
      const endDate = new Date(bookingData.endTime);
      const durationMs = endDate - startDate;
      const durationHours = durationMs / (1000 * 60 * 60);
      
      if (durationHours < 1) {
        alert('⚠️ Minimum parking time is 1 hour\n\nPlease select an end time that is at least 1 hour after the start time.');
        return;
      }
      
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
          <h2 className="text-xl font-semibold mb-6 text-gray-800">📅 Select Your Parking Time</h2>
          <p className="text-sm text-gray-500 mb-4">Minimum booking duration: 1 hour | Rate: ₹50/hour</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Time */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border-2 border-blue-100">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">1</span>
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={bookingData.startTime}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => {
                  const newStartTime = e.target.value;
                  setBookingData({ ...bookingData, startTime: newStartTime });
                  
                  // Auto-set end time to 1 hour later if not set or less than 1 hour
                  if (!bookingData.endTime || newStartTime) {
                    const start = new Date(newStartTime);
                    const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
                    setBookingData({ 
                      ...bookingData, 
                      startTime: newStartTime,
                      endTime: end.toISOString().slice(0, 16)
                    });
                  }
                }}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                required
              />
            </div>

            {/* End Time */}
            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border-2 border-green-100">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">2</span>
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={bookingData.endTime}
                min={bookingData.startTime || new Date().toISOString().slice(0, 16)}
                onChange={(e) =>
                  setBookingData({ ...bookingData, endTime: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-base"
                required
              />
            </div>
          </div>

          {/* Duration Display */}
          {bookingData.startTime && bookingData.endTime && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Parking Duration</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {(() => {
                      const start = new Date(bookingData.startTime);
                      const end = new Date(bookingData.endTime);
                      const hours = ((end - start) / (1000 * 60 * 60)).toFixed(1);
                      return hours >= 1 
                        ? `${hours} hour${hours > 1 ? 's' : ''}`
                        : '⚠️ Less than 1 hour';
                    })()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(() => {
                      const start = new Date(bookingData.startTime);
                      const end = new Date(bookingData.endTime);
                      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
                      return hours >= 1 ? hours * 50 : 50;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleTimeChange} 
            className="btn-primary w-full py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            disabled={!bookingData.startTime || !bookingData.endTime}
          >
            🔍 Check Available Slots
          </button>
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
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚗</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Confirm Your Booking</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Slot Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Parking Slot</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedSlot.slot_code}</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full">
                      <p className="text-sm font-semibold capitalize text-gray-700">
                        {selectedSlot.slot_type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration Info */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">⏰ Duration</p>
                      <p className="text-lg font-bold text-gray-800">
                        {(() => {
                          const start = new Date(bookingData.startTime);
                          const end = new Date(bookingData.endTime);
                          const hours = ((end - start) / (1000 * 60 * 60)).toFixed(1);
                          return `${hours} hour${hours > 1 ? 's' : ''}`;
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">💰 Total Cost</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{(() => {
                          const start = new Date(bookingData.startTime);
                          const end = new Date(bookingData.endTime);
                          const hours = Math.ceil((end - start) / (1000 * 60 * 60));
                          return hours * 50;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">From</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(bookingData.startTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">To</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(bookingData.endTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🚙 Vehicle Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., MH-12-AB-1234"
                    value={bookingData.vehicleNumber}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, vehicleNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBooking} 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
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
