import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Parking lot management
router.get('/parking-lots', adminController.getAllParkingLots);
router.post('/parking-lots', adminController.createParkingLot);
router.patch('/parking-lots/:lotId', adminController.updateParkingLot);
router.delete('/parking-lots/:lotId', adminController.deleteParkingLot);

// Slot management
router.get('/parking-lots/:lotId/slots', adminController.getSlots);
router.post('/slots', adminController.createSlot);
router.patch('/slots/:slotId', adminController.updateSlot);
router.delete('/slots/:slotId', adminController.deleteSlot);

// Booking management
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:bookingId/approve', adminController.approveBooking);
router.patch('/bookings/:bookingId/decline', adminController.declineBooking);

// Analytics
router.get('/analytics', adminController.getAnalytics);

export default router;
