import { query } from '../db.js';

// Get all parking lots (admin view)
export const getAllParkingLots = async (req, res) => {
  try {
    const result = await query(
      `SELECT pl.*, 
        COUNT(s.id) as total_slots,
        COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_slots,
        COUNT(CASE WHEN s.is_active = false THEN 1 END) as inactive_slots
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

// Create parking lot
export const createParkingLot = async (req, res) => {
  console.log('=== CREATE PARKING LOT REQUEST ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('User:', req.user);
  
  const { name, address, description } = req.body;

  if (!name) {
    console.log('❌ Validation failed: Name is required');
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    console.log('Inserting parking lot:', { name, address, description });
    const result = await query(
      'INSERT INTO parking_lots (name, address, description) VALUES ($1, $2, $3) RETURNING *',
      [name, address, description]
    );

    console.log('✅ Parking lot created:', result.rows[0]);
    res.status(201).json({
      parkingLot: result.rows[0],
      message: 'Parking lot created successfully',
    });
  } catch (error) {
    console.error('❌ Error creating parking lot:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create parking lot' });
  }
};

// Update parking lot
export const updateParkingLot = async (req, res) => {
  const { lotId } = req.params;
  const { name, address, description } = req.body;

  try {
    const result = await query(
      `UPDATE parking_lots 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *`,
      [name, address, description, lotId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Parking lot not found' });
    }

    res.json({
      parkingLot: result.rows[0],
      message: 'Parking lot updated successfully',
    });
  } catch (error) {
    console.error('Error updating parking lot:', error);
    res.status(500).json({ error: 'Failed to update parking lot' });
  }
};

// Delete parking lot
export const deleteParkingLot = async (req, res) => {
  const { lotId } = req.params;

  try {
    const result = await query('DELETE FROM parking_lots WHERE id = $1 RETURNING *', [lotId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Parking lot not found' });
    }

    res.json({ message: 'Parking lot deleted successfully' });
  } catch (error) {
    console.error('Error deleting parking lot:', error);
    res.status(500).json({ error: 'Failed to delete parking lot' });
  }
};

// Get all slots for a parking lot
export const getSlots = async (req, res) => {
  const { lotId } = req.params;

  try {
    const result = await query(
      `SELECT s.*,
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.status = 'booked' THEN 1 END) as active_bookings
       FROM slots s
       LEFT JOIN bookings b ON s.id = b.slot_id
       WHERE s.parking_lot_id = $1
       GROUP BY s.id
       ORDER BY s.slot_code`,
      [lotId]
    );

    res.json({ slots: result.rows });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
};

// Create slot
export const createSlot = async (req, res) => {
  const { parkingLotId, slotCode, slotType } = req.body;

  if (!parkingLotId || !slotCode) {
    return res.status(400).json({ error: 'Parking lot ID and slot code are required' });
  }

  try {
    const result = await query(
      `INSERT INTO slots (parking_lot_id, slot_code, slot_type, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [parkingLotId, slotCode, slotType || 'car']
    );

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('slot_update', {
        slotId: result.rows[0].id,
        status: 'created',
        slot: result.rows[0],
      });
    }

    res.status(201).json({
      slot: result.rows[0],
      message: 'Slot created successfully',
    });
  } catch (error) {
    console.error('Error creating slot:', error);

    if (error.code === '23505') {
      // Unique constraint violation
      return res.status(409).json({ error: 'Slot code already exists in this parking lot' });
    }

    res.status(500).json({ error: 'Failed to create slot' });
  }
};

// Update slot
export const updateSlot = async (req, res) => {
  const { slotId } = req.params;
  const { slotCode, slotType, isActive } = req.body;

  try {
    const result = await query(
      `UPDATE slots 
       SET slot_code = COALESCE($1, slot_code),
           slot_type = COALESCE($2, slot_type),
           is_active = COALESCE($3, is_active)
       WHERE id = $4
       RETURNING *`,
      [slotCode, slotType, isActive, slotId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('slot_update', {
        slotId: result.rows[0].id,
        status: 'updated',
        slot: result.rows[0],
      });
    }

    res.json({
      slot: result.rows[0],
      message: 'Slot updated successfully',
    });
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ error: 'Failed to update slot' });
  }
};

// Delete slot
export const deleteSlot = async (req, res) => {
  const { slotId } = req.params;

  try {
    const result = await query('DELETE FROM slots WHERE id = $1 RETURNING *', [slotId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('slot_update', {
        slotId,
        status: 'deleted',
      });
    }

    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
};

// Get all bookings (admin view)
export const getAllBookings = async (req, res) => {
  const { status, parkingLotId } = req.query;

  try {
    let queryText = `
      SELECT b.*, 
        s.slot_code, s.slot_type,
        pl.id as parking_lot_id, pl.name as parking_lot_name,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      JOIN parking_lots pl ON s.parking_lot_id = pl.id
      JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (status) {
      queryText += ` AND b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (parkingLotId) {
      queryText += ` AND pl.id = $${paramCount}`;
      params.push(parkingLotId);
      paramCount++;
    }

    queryText += ` ORDER BY b.created_at DESC`;

    const result = await query(queryText, params);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get analytics/statistics
export const getAnalytics = async (req, res) => {
  try {
    // Total statistics
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM parking_lots) as total_parking_lots,
        (SELECT COUNT(*) FROM slots) as total_slots,
        (SELECT COUNT(*) FROM slots WHERE is_active = true) as active_slots,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'booked') as active_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'cancelled') as cancelled_bookings
    `);

    // Bookings by parking lot
    const byParkingLot = await query(`
      SELECT 
        pl.id,
        pl.name,
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.status = 'booked' THEN 1 END) as active_bookings
      FROM parking_lots pl
      LEFT JOIN slots s ON pl.id = s.parking_lot_id
      LEFT JOIN bookings b ON s.id = b.slot_id
      GROUP BY pl.id, pl.name
      ORDER BY total_bookings DESC
    `);

    // Recent bookings
    const recentBookings = await query(`
      SELECT b.*, 
        s.slot_code,
        pl.name as parking_lot_name,
        u.name as user_name
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      JOIN parking_lots pl ON s.parking_lot_id = pl.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `);

    res.json({
      stats: stats.rows[0],
      byParkingLot: byParkingLot.rows,
      recentBookings: recentBookings.rows,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Approve booking
export const approveBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const result = await query(
      `UPDATE bookings 
       SET status = 'booked', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'pending'
       RETURNING *`,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or already processed' });
    }

    const booking = result.rows[0];

    // Get full booking details
    const bookingDetails = await query(
      `SELECT b.*, 
        s.slot_code, s.slot_type, s.parking_lot_id,
        pl.name as parking_lot_name,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      JOIN parking_lots pl ON s.parking_lot_id = pl.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1`,
      [bookingId]
    );

    const fullBooking = bookingDetails.rows[0];

    // Emit socket event
    const io = req.app.get('io');
    if (io && fullBooking) {
      io.to(`parking_lot_${fullBooking.parking_lot_id}`).emit('slot_update', {
        slotId: fullBooking.slot_id,
        parkingLotId: fullBooking.parking_lot_id,
        status: 'booked',
        bookingId,
      });
      io.emit('booking_approved', { bookingId, booking: fullBooking });
    }

    res.json({
      booking: fullBooking || booking,
      message: 'Booking approved successfully',
    });
  } catch (error) {
    console.error('Error approving booking:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to approve booking', details: error.message });
  }
};

// Decline booking
export const declineBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { reason } = req.body;

  try {
    const result = await query(
      `UPDATE bookings 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'pending'
       RETURNING *`,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or already processed' });
    }

    // Get full booking details
    const bookingDetails = await query(
      `SELECT b.*, 
        s.slot_code, s.slot_type, s.parking_lot_id,
        pl.name as parking_lot_name,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      JOIN parking_lots pl ON s.parking_lot_id = pl.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1`,
      [bookingId]
    );

    // Emit socket event
    const io = req.app.get('io');
    if (io && bookingDetails.rows.length > 0) {
      const booking = bookingDetails.rows[0];
      io.to(`parking_lot_${booking.parking_lot_id}`).emit('slot_update', {
        slotId: booking.slot_id,
        parkingLotId: booking.parking_lot_id,
        status: 'cancelled',
        bookingId,
      });
      io.emit('booking_declined', { booking, reason });
    }

    res.json({
      booking: bookingDetails.rows[0],
      message: 'Booking declined successfully',
    });
  } catch (error) {
    console.error('Error declining booking:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to decline booking', details: error.message });
  }
};
