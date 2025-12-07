import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllParkingLots,
  createParkingLot,
  createSlot,
  updateSlot,
  getSlots,
  getAllBookings,
  getAnalytics,
  approveBooking,
  declineBooking,
} from '../api/admin';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [parkingLots, setParkingLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newLot, setNewLot] = useState({ name: '', address: '', description: '' });
  const [newSlot, setNewSlot] = useState({ slotCode: '', slotType: 'car' });

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    console.log('AdminPanel: Checking user access');
    console.log('User from localStorage:', user);
    console.log('User role:', user?.role);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      console.log('User is not admin, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    
    console.log('User is admin, loading data');
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lotsData, bookingsData, analyticsData] = await Promise.all([
        getAllParkingLots(),
        getAllBookings(),
        getAnalytics(),
      ]);
      setParkingLots(lotsData.parkingLots);
      setBookings(bookingsData.bookings);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddParkingLot = async () => {
    try {
      console.log('Creating parking lot with data:', newLot);
      const result = await createParkingLot(newLot);
      console.log('Parking lot created:', result);
      setShowAddLotModal(false);
      setNewLot({ name: '', address: '', description: '' });
      fetchData();
      alert('Parking lot created successfully');
    } catch (err) {
      console.error('Error creating parking lot:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create parking lot';
      setError(errorMsg);
      alert('Error: ' + errorMsg);
    }
  };

  const handleSelectLot = async (lot) => {
    setSelectedLot(lot);
    try {
      const slotsData = await getSlots(lot.id);
      setSlots(slotsData.slots);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load slots');
    }
  };

  const handleAddSlot = async () => {
    if (!selectedLot) return;
    try {
      await createSlot({
        parkingLotId: selectedLot.id,
        slotCode: newSlot.slotCode,
        slotType: newSlot.slotType,
      });
      setShowAddSlotModal(false);
      setNewSlot({ slotCode: '', slotType: 'car' });
      handleSelectLot(selectedLot);
      alert('Slot created successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create slot');
    }
  };

  const handleToggleSlot = async (slot) => {
    try {
      await updateSlot(slot.id, { isActive: !slot.is_active });
      handleSelectLot(selectedLot);
      alert('Slot updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update slot');
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await approveBooking(bookingId);
      fetchData();
      alert('Booking approved successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve booking');
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    const reason = prompt('Enter reason for declining (optional):');
    try {
      await declineBooking(bookingId, reason);
      fetchData();
      alert('Booking declined');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to decline booking');
    }
  };

  if (loading && !analytics) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError(null)} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'pending'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Requests {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('parking-lots')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'parking-lots'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Parking Lots
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Bookings
          </button>
        </div>

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Pending Booking Requests</h2>
            {bookings.filter(b => b.status === 'pending').length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.filter(b => b.status === 'pending').map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.parking_lot_name}
                        </h3>
                        <p className="text-gray-600">Slot: {booking.slot_code} ({booking.slot_type})</p>
                        {booking.vehicle_number && (
                          <p className="text-gray-700 font-medium">Vehicle: {booking.vehicle_number}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          <p><span className="font-medium">User:</span> {booking.user_name} ({booking.user_email})</p>
                          <p><span className="font-medium">From:</span> {new Date(booking.start_time).toLocaleString()}</p>
                          <p><span className="font-medium">To:</span> {new Date(booking.end_time).toLocaleString()}</p>
                          <p><span className="font-medium">Requested:</span> {new Date(booking.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleApproveBooking(booking.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleDeclineBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          ✗ Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <p className="text-sm text-gray-500">Total Parking Lots</p>
                <p className="text-3xl font-bold text-primary-600">
                  {analytics.stats.total_parking_lots}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Total Slots</p>
                <p className="text-3xl font-bold text-primary-600">
                  {analytics.stats.total_slots}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Active Bookings</p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.stats.active_bookings}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.stats.total_users}
                </p>
              </div>
            </div>

            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4">Bookings by Parking Lot</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Parking Lot</th>
                      <th className="text-left py-3 px-4">Total Bookings</th>
                      <th className="text-left py-3 px-4">Active Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.byParkingLot.map((lot) => (
                      <tr key={lot.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{lot.name}</td>
                        <td className="py-3 px-4">{lot.total_bookings}</td>
                        <td className="py-3 px-4">{lot.active_bookings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Parking Lots Tab */}
        {activeTab === 'parking-lots' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Parking Lots Management</h2>
              <button onClick={() => setShowAddLotModal(true)} className="btn-primary">
                Add Parking Lot
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Parking Lots List */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">All Parking Lots</h3>
                <div className="space-y-3">
                  {parkingLots.map((lot) => (
                    <div
                      key={lot.id}
                      onClick={() => handleSelectLot(lot)}
                      className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${
                        selectedLot?.id === lot.id ? 'border-primary-500 bg-primary-50' : ''
                      }`}
                    >
                      <h4 className="font-semibold">{lot.name}</h4>
                      <p className="text-sm text-gray-600">{lot.address}</p>
                      <div className="mt-2 flex space-x-4 text-sm">
                        <span>Total: {lot.total_slots}</span>
                        <span className="text-green-600">Active: {lot.active_slots}</span>
                        <span className="text-gray-500">Inactive: {lot.inactive_slots}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slots Management */}
              <div className="card">
                {selectedLot ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Slots - {selectedLot.name}
                      </h3>
                      <button
                        onClick={() => setShowAddSlotModal(true)}
                        className="btn-primary text-sm"
                      >
                        Add Slot
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 border rounded-lg text-center ${
                            slot.is_active ? 'bg-white' : 'bg-gray-100'
                          }`}
                        >
                          <div className="font-semibold">{slot.slot_code}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {slot.slot_type}
                          </div>
                          <button
                            onClick={() => handleToggleSlot(slot)}
                            className={`mt-2 text-xs px-2 py-1 rounded ${
                              slot.is_active
                                ? 'bg-red-100 text-red-600'
                                : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {slot.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    Select a parking lot to manage slots
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Parking Lot</th>
                    <th className="text-left py-3 px-4">Slot</th>
                    <th className="text-left py-3 px-4">Vehicle</th>
                    <th className="text-left py-3 px-4">Start Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{booking.user_name}</td>
                      <td className="py-3 px-4">{booking.parking_lot_name}</td>
                      <td className="py-3 px-4">{booking.slot_code}</td>
                      <td className="py-3 px-4 font-medium">{booking.vehicle_number || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {new Date(booking.start_time).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'booked'
                              ? 'bg-blue-100 text-blue-800'
                              : booking.status === 'checked_in'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'completed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Parking Lot Modal */}
        {showAddLotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Add Parking Lot</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={newLot.name}
                    onChange={(e) => setNewLot({ ...newLot, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={newLot.address}
                    onChange={(e) => setNewLot({ ...newLot, address: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newLot.description}
                    onChange={(e) =>
                      setNewLot({ ...newLot, description: e.target.value })
                    }
                    className="input-field"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowAddLotModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handleAddParkingLot} className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Slot Modal */}
        {showAddSlotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Add Slot</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Slot Code *</label>
                  <input
                    type="text"
                    value={newSlot.slotCode}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, slotCode: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., A1, B2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slot Type *</label>
                  <select
                    value={newSlot.slotType}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, slotType: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="ev">EV</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowAddSlotModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handleAddSlot} className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
