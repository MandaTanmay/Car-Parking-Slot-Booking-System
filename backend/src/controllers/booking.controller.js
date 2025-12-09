import { query, transaction } from '../db.js';
import { generateQRToken } from '../auth.js';
import { generateQRCode } from '../utils/qr.js';

// Get all parking lots
export const getParkingLots = async (req, res) => {
  try {
    const result = await query(
      `SELECT pl.*, 
        COUNT(s.id) as total_slots,
        COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_slots
       FROM parking_lots pl
       LEFT JOIN slots s ON pl.id = s.parking_lot_id
       GROUP BY pl.id
       ORDER BY pl.created_at DESC`
    );

    res.json({ parkingLots: result.rows });
  } catch (error) {
    console.error('Error fetching parking lots:', error);
    res.status(500).json({ error: 'Failed to fetch parking lots' });
  }
};

// Get slots for a parking lot with availability
export const getSlotsByParkingLot = async (req, res) => {
  const { lotId } = req.params;
  const { startTime, endTime } = req.query;

  try {
    let queryText = `
      SELECT s.*,
        CASE WHEN EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.slot_id = s.id
          AND b.status IN ('booked', 'checked_in')
          ${startTime && endTime ? 
            `AND NOT (b.end_time <= $2 OR b.start_time >= $3)` : ''}
        ) THEN false ELSE true END as is_available
      FROM slots s
      WHERE s.parking_lot_id = $1
      ORDER BY s.slot_code
    `;

    const params = startTime && endTime 
      ? [lotId, startTime, endTime]
      : [lotId];

    const result = await query(queryText, params);

    res.json({ slots: result.rows });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  try {
    let queryText = `
      SELECT b.*, 
        s.slot_code, s.slot_type,
        pl.name as parking_lot_name, pl.address as parking_lot_address, pl.hourly_rate
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      JOIN parking_lots pl ON s.parking_lot_id = pl.id
      WHERE b.user_id = $1
    `;

    const params = [userId];

    if (status) {
      queryText += ` AND b.status = $2`;
      params.push(status);
    }

    queryText += ` ORDER BY b.start_time DESC`;

    const result = await query(queryText, params);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking details
export const getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  try {
    const queryText = `
      SELECT b.*, 
        s.slot_code, s.slot_type,
        pl.name as parking_lot_name, pl.address as parking_lot_address, pl.hourly_rate,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      JOIN parking_lots pl ON s.parking_lot_id = pl.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1 ${!isAdmin ? 'AND b.user_id = $2' : ''}
    `;

    const params = isAdmin ? [bookingId] : [bookingId, userId];
    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Generate QR code if not cancelled
    const booking = result.rows[0];
    if (booking.status !== 'cancelled' && booking.qr_code_token) {
      booking.qr_code = await generateQRCode(booking.qr_code_token);
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Create a new booking with conflict prevention
export const createBooking = async (req, res) => {
  console.log('=== CREATE BOOKING REQUEST ===');
  console.log('Body:', req.body);
  console.log('User:', req.user);
  
  const { slotId, startTime, endTime, vehicleNumber } = req.body;
  const userId = req.user.id;

  // Validation
  if (!slotId || !startTime || !endTime || !vehicleNumber) {
    console.log('❌ Validation failed: Missing fields');
    return res.status(400).json({ error: 'Missing required fields (slot, times, and vehicle number)' });
  }
  
  if (!vehicleNumber.trim()) {
    console.log('❌ Validation failed: Vehicle number is empty');
    return res.status(400).json({ error: 'Vehicle number is required' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  
  // Allow bookings up to 5 minutes in the past to account for clock differences
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  console.log('Start time:', start.toISOString());
  console.log('End time:', end.toISOString());
  console.log('Current time:', now.toISOString());

  if (start >= end) {
    console.log('❌ Validation failed: End time must be after start time');
    return res.status(400).json({ error: 'End time must be after start time' });
  }

  if (start < fiveMinutesAgo) {
    console.log('❌ Validation failed: Cannot book in the past');
    console.log('Start time is', Math.round((now - start) / 1000 / 60), 'minutes ago');
    return res.status(400).json({ error: 'Cannot book in the past' });
  }
  
  console.log('✅ Validation passed, proceeding with transaction');

  try {
    const result = await transaction(async (client) => {
      // Lock the slot row to prevent race conditions
      const slotCheck = await client.query(
        'SELECT * FROM slots WHERE id = $1 FOR UPDATE',
        [slotId]
      );

      if (slotCheck.rows.length === 0) {
        throw new Error('Slot not found');
      }

      if (!slotCheck.rows[0].is_active) {
        throw new Error('Slot is not active');
      }

      // Check for conflicting bookings
      const conflictCheck = await client.query(
        `SELECT id FROM bookings
         WHERE slot_id = $1
         AND status IN ('booked', 'checked_in')
         AND NOT (end_time <= $2 OR start_time >= $3)
         FOR UPDATE`,
        [slotId, startTime, endTime]
      );

      if (conflictCheck.rows.length > 0) {
        throw new Error('Slot is already booked for the selected time period');
      }

      // Create booking with booked status
      const bookingResult = await client.query(
        `INSERT INTO bookings (user_id, slot_id, start_time, end_time, vehicle_number, status)
         VALUES ($1, $2, $3, $4, $5, 'booked')
         RETURNING *`,
        [userId, slotId, startTime, endTime, vehicleNumber.trim().toUpperCase()]
      );

      const booking = bookingResult.rows[0];

      // Generate QR token
      const qrToken = generateQRToken(booking.id, userId);

      // Update booking with QR token
      await client.query(
        'UPDATE bookings SET qr_code_token = $1 WHERE id = $2',
        [qrToken, booking.id]
      );

      booking.qr_code_token = qrToken;

      return booking;
    });

    // Generate QR code
    console.log('Generating QR code for booking:', result.id);
    const qrCode = await generateQRCode(result.qr_code_token);

    // Get slot and parking lot info for socket event
    const slotInfo = await query(
      'SELECT s.parking_lot_id FROM slots s WHERE s.id = $1',
      [slotId]
    );

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io && slotInfo.rows.length > 0) {
      const parkingLotId = slotInfo.rows[0].parking_lot_id;
      io.to(`parking_lot_${parkingLotId}`).emit('slot_update', {
        slotId,
        parkingLotId,
        status: 'booked',
        bookingId: result.id,
      });
      console.log('✅ Emitted slot_update event for parking lot:', parkingLotId);
    }

    console.log('✅ Booking created successfully:', result.id);
    res.status(201).json({
      booking: { ...result, qr_code: qrCode },
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message.includes('already booked')) {
      return res.status(409).json({ error: error.message });
    }
    
    if (error.message.includes('not found') || error.message.includes('not active')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  try {
    const result = await transaction(async (client) => {
      // Check if booking exists and belongs to user
      const bookingCheck = await client.query(
        `SELECT b.*, s.id as slot_id, s.parking_lot_id 
         FROM bookings b
         JOIN slots s ON b.slot_id = s.id
         WHERE b.id = $1 ${!isAdmin ? 'AND b.user_id = $2' : ''}
         FOR UPDATE`,
        isAdmin ? [bookingId] : [bookingId, userId]
      );

      if (bookingCheck.rows.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingCheck.rows[0];

      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      if (booking.status === 'completed') {
        throw new Error('Cannot cancel completed booking');
      }

      // Update booking status
      await client.query(
        'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['cancelled', bookingId]
      );

      return booking;
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`parking_lot_${result.parking_lot_id}`).emit('slot_update', {
        slotId: result.slot_id,
        parkingLotId: result.parking_lot_id,
        status: 'cancelled',
        bookingId,
      });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);

    if (error.message.includes('not found') || error.message.includes('already') || error.message.includes('Cannot')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Get booking details from QR code (for viewing)
export const getBookingFromQR = async (req, res) => {
  const { qrToken } = req.query;

  if (!qrToken) {
    return res.status(400).json({ error: 'QR token required' });
  }

  try {
    const { verifyToken } = await import('../auth.js');
    const decoded = verifyToken(qrToken);

    if (decoded.type !== 'qr_checkin') {
      return res.status(400).json({ error: 'Invalid QR code type' });
    }

    const result = await query(
      `SELECT b.*, 
              s.slot_code, s.slot_type,
              pl.name as parking_lot_name, pl.address as parking_lot_address, pl.hourly_rate,
              u.name as user_name, u.email as user_email
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN parking_lots pl ON s.parking_lot_id = pl.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [decoded.bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Error getting booking from QR:', error);

    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(403).json({ error: 'Invalid or expired QR code' });
    }

    res.status(500).json({ error: 'Failed to get booking details' });
  }
};

// Check-in with QR code
export const checkInWithQR = async (req, res) => {
  const { qrToken } = req.body;

  if (!qrToken) {
    return res.status(400).json({ error: 'QR token required' });
  }

  try {
    const { verifyToken } = await import('../auth.js');
    const decoded = verifyToken(qrToken);

    if (decoded.type !== 'qr_checkin') {
      return res.status(400).json({ error: 'Invalid QR code type' });
    }

    const result = await transaction(async (client) => {
      const bookingCheck = await client.query(
        `SELECT b.*, s.slot_code, pl.name as parking_lot_name
         FROM bookings b
         JOIN slots s ON b.slot_id = s.id
         JOIN parking_lots pl ON s.parking_lot_id = pl.id
         WHERE b.id = $1 AND b.user_id = $2
         FOR UPDATE`,
        [decoded.bookingId, decoded.userId]
      );

      if (bookingCheck.rows.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingCheck.rows[0];

      if (booking.status === 'cancelled') {
        throw new Error('Booking has been cancelled');
      }

      if (booking.status === 'checked_in') {
        throw new Error('Already checked in');
      }

      // Check if booking time is valid
      const now = new Date();
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);

      if (now < startTime) {
        throw new Error('Check-in time has not started yet');
      }

      if (now > endTime) {
        throw new Error('Booking time has expired');
      }

      // Update status to checked_in
      await client.query(
        'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['checked_in', decoded.bookingId]
      );

      return booking;
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('slot_update', {
        slotId: result.slot_id,
        status: 'checked_in',
        bookingId: decoded.bookingId,
      });
    }

    res.json({
      message: 'Checked in successfully',
      booking: result,
    });
  } catch (error) {
    console.error('Error checking in:', error);

    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(403).json({ error: 'Invalid or expired QR code' });
    }

    if (error.message.includes('not found') || error.message.includes('cancelled') || 
        error.message.includes('Already') || error.message.includes('time')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to check in' });
  }
};
