import api from './api';

// Get all parking lots
export const getParkingLots = async () => {
  const response = await api.get('/api/parking-lots');
  return response.data;
};

// Get slots for a parking lot
export const getSlotsByParkingLot = async (lotId, startTime, endTime) => {
  const params = {};
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;
  
  const response = await api.get(`/api/parking-lots/${lotId}/slots`, { params });
  return response.data;
};

// Get user's bookings
export const getUserBookings = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get('/api/bookings', { params });
  return response.data;
};

// Get booking details
export const getBookingDetails = async (bookingId) => {
  const response = await api.get(`/api/bookings/${bookingId}`);
  return response.data;
};

// Create booking
export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/api/bookings/${bookingId}/cancel`);
  return response.data;
};

// Check-in with QR code
export const checkInWithQR = async (qrToken) => {
  const response = await api.post('/api/bookings/check-in', { qrToken });
  return response.data;
};
