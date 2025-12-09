import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Load environment variables
dotenv.config();

// Run database migration on startup
async function runMigrations() {
  try {
    console.log('🔧 Running database migrations...');
    
    // Add 'pending' to booking status constraint
    await query(`
      ALTER TABLE bookings 
      DROP CONSTRAINT IF EXISTS bookings_status_check;
    `);
    
    await query(`
      ALTER TABLE bookings 
      ADD CONSTRAINT bookings_status_check 
      CHECK (status IN ('pending', 'booked', 'cancelled', 'checked_in', 'completed'));
    `);
    
    await query(`
      ALTER TABLE bookings 
      ALTER COLUMN status SET DEFAULT 'pending';
    `);
    
    console.log('✅ Database migrations completed');
  } catch (error) {
    if (error.message.includes('already exists') || error.code === '42710') {
      console.log('⚠️  Migration already applied, skipping');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  }
}

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store io instance in app for access in controllers
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚗 ParkEasy API - Car Parking Slot Booking System',
    version: '1.0.2',
    status: 'running',
    endpoints: {
      health: '/health',
      dbHealth: '/health/db',
      auth: '/api/auth',
      bookings: '/api',
      admin: '/api/admin',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.5' 
  });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    const { query } = await import('./db.js');
    const result = await query('SELECT NOW() as time, COUNT(*) as parking_lots FROM parking_lots');
    res.json({ 
      status: 'OK', 
      database: 'connected',
      timestamp: result.rows[0].time,
      parkingLots: result.rows[0].parking_lots
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Firebase health check
app.get('/health/firebase', async (req, res) => {
  try {
    const { auth } = await import('./config/firebase.js');
    const hasBase64 = !!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const hasIndividual = !!process.env.FIREBASE_PRIVATE_KEY;
    const hasFile = !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    res.json({ 
      status: 'OK',
      firebase: auth ? 'initialized' : 'not initialized',
      credentials: {
        base64: hasBase64 ? `present (${process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.length} chars)` : 'missing',
        individual: hasIndividual ? 'present' : 'missing',
        file: hasFile ? 'present' : 'missing'
      }
    });
  } catch (error) {
    console.error('Firebase health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      firebase: 'failed to initialize',
      error: error.message 
    });
  }
});

// Debug endpoint to check CORS configuration
app.get('/debug/config', (req, res) => {
  res.json({
    frontendUrl: process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV,
    corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Join parking lot room
  socket.on('join_parking_lot', (parkingLotId) => {
    socket.join(`parking_lot_${parkingLotId}`);
    console.log(`Client ${socket.id} joined parking_lot_${parkingLotId}`);
  });

  // Leave parking lot room
  socket.on('leave_parking_lot', (parkingLotId) => {
    socket.leave(`parking_lot_${parkingLotId}`);
    console.log(`Client ${socket.id} left parking_lot_${parkingLotId}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

// Run migrations before starting server
runMigrations().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
