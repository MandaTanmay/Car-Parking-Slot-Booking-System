import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import * as bookingController from '../controllers/booking.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all parking lots
router.get('/parking-lots', bookingController.getParkingLots);

// Get slots for a parking lot
router.get('/parking-lots/:lotId/slots', bookingController.getSlotsByParkingLot);

// Get user's bookings
router.get('/bookings', bookingController.getUserBookings);

// Get booking details
router.get('/bookings/:bookingId', bookingController.getBookingDetails);

// Create new booking
router.post('/bookings', bookingController.createBooking);

// Cancel booking
router.patch('/bookings/:bookingId/cancel', bookingController.cancelBooking);

// Check-in with QR code
router.post('/bookings/check-in', bookingController.checkInWithQR);

export default router;
