import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ParkingLot from './pages/ParkingLot';
import BookingPage from './pages/BookingPage';
import AdminPanel from './pages/AdminPanel';
import Features from './pages/Features';
import AboutUs from './pages/AboutUs';
import QRScanner from './pages/QRScanner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  console.log('App component rendering...');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<AboutUs />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/parking-lot/:lotId"
          element={
            <ProtectedRoute>
              <ParkingLot />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/booking/:bookingId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
