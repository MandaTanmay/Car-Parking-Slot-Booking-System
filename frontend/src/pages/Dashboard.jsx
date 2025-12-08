import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getParkingLots, getUserBookings } from '../api/bookings';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [parkingLots, setParkingLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    console.log('Dashboard: User accessing dashboard:', user);
    
    // Redirect admin users to admin panel
    if (user?.role === 'admin') {
      console.log('Admin user detected, redirecting to admin panel');
      navigate('/admin', { replace: true });
      return;
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lotsData, bookingsData] = await Promise.all([
        getParkingLots(),
        getUserBookings(),
      ]);
      setParkingLots(lotsData.parkingLots);
      setBookings(bookingsData.bookings);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (status) => {
    const now = new Date();
    return bookings.filter((booking) => {
      if (status === 'upcoming') {
        return (
          booking.status === 'booked' &&
          new Date(booking.start_time) > now
        );
      } else if (status === 'active') {
        return (
          (booking.status === 'booked' || booking.status === 'checked_in') &&
          new Date(booking.start_time) <= now &&
          new Date(booking.end_time) >= now
        );
      } else if (status === 'past') {
        return (
          booking.status === 'completed' ||
          booking.status === 'cancelled' ||
          (booking.status === 'booked' && new Date(booking.end_time) < now)
        );
      }
      return false;
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
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

        {/* Parking Lots Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Parking Lots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkingLots.map((lot) => (
              <Link
                key={lot.id}
                to={`/parking-lot/${lot.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {lot.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{lot.address}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Slots</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {lot.total_slots || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                      {lot.active_slots || 0}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'upcoming'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'active'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'past'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past
            </button>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filterBookings(activeTab).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              filterBookings(activeTab).map((booking) => (
                <Link
                  key={booking.id}
                  to={`/booking/${booking.id}`}
                  className="card flex justify-between items-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.parking_lot_name}
                    </h3>
                    <p className="text-gray-600">Slot: {booking.slot_code}</p>
                    {booking.vehicle_number && (
                      <p className="text-gray-600 font-medium">Vehicle: {booking.vehicle_number}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      <p>From: {formatDateTime(booking.start_time)}</p>
                      <p>To: {formatDateTime(booking.end_time)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'checked_in'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : booking.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
