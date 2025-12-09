import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function updateBookingStatusConstraint() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Starting database migration...');
    
    // Drop the old constraint
    console.log('1. Dropping old status constraint...');
    await client.query(`
      ALTER TABLE bookings 
      DROP CONSTRAINT IF EXISTS bookings_status_check;
    `);
    
    // Add new constraint with 'pending' status
    console.log('2. Adding new status constraint with pending...');
    await client.query(`
      ALTER TABLE bookings 
      ADD CONSTRAINT bookings_status_check 
      CHECK (status IN ('pending', 'booked', 'cancelled', 'checked_in', 'completed'));
    `);
    
    // Update default value
    console.log('3. Updating default status to pending...');
    await client.query(`
      ALTER TABLE bookings 
      ALTER COLUMN status SET DEFAULT 'pending';
    `);
    
    console.log('✅ Migration completed successfully!');
    console.log('📝 Bookings table now supports: pending, booked, cancelled, checked_in, completed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateBookingStatusConstraint()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
