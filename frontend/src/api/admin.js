import api from './api';

// Get all parking lots (admin)
export const getAllParkingLots = async () => {
  const response = await api.get('/api/admin/parking-lots');
  return response.data;
};

// Create parking lot
export const createParkingLot = async (data) => {
  const response = await api.post('/api/admin/parking-lots', data);
  return response.data;
};

// Update parking lot
export const updateParkingLot = async (lotId, data) => {
  const response = await api.patch(`/api/admin/parking-lots/${lotId}`, data);
  return response.data;
};

// Delete parking lot
export const deleteParkingLot = async (lotId) => {
  const response = await api.delete(`/api/admin/parking-lots/${lotId}`);
  return response.data;
};

// Get slots
export const getSlots = async (lotId) => {
  const response = await api.get(`/api/admin/parking-lots/${lotId}/slots`);
  return response.data;
};

// Create slot
export const createSlot = async (data) => {
  const response = await api.post('/api/admin/slots', data);
  return response.data;
};

// Update slot
export const updateSlot = async (slotId, data) => {
  const response = await api.patch(`/api/admin/slots/${slotId}`, data);
  return response.data;
};

// Delete slot
export const deleteSlot = async (slotId) => {
  const response = await api.delete(`/api/admin/slots/${slotId}`);
  return response.data;
};

// Get all bookings
export const getAllBookings = async (status, parkingLotId) => {
  const params = {};
  if (status) params.status = status;
  if (parkingLotId) params.parkingLotId = parkingLotId;
  
  const response = await api.get('/api/admin/bookings', { params });
  return response.data;
};

// Approve booking
export const approveBooking = async (bookingId) => {
  const response = await api.patch(`/api/admin/bookings/${bookingId}/approve`);
  return response.data;
};

// Decline booking
export const declineBooking = async (bookingId, reason) => {
  const response = await api.patch(`/api/admin/bookings/${bookingId}/decline`, { reason });
  return response.data;
};

// Get analytics
export const getAnalytics = async () => {
  const response = await api.get('/api/admin/analytics');
  return response.data;
};
