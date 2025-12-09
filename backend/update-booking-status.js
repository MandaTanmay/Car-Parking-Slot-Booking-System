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
    console.log('🔧 Starting database migration for booking status...');
    
    // Check if we need to migrate
    const checkResult = await client.query(`
      SELECT constraint_name 
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'bookings_status_check'
      AND constraint_schema = 'public';
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('Found existing status constraint, updating...');
      
      // Drop the old constraint
      console.log('1. Dropping old status constraint...');
      await client.query(`
        ALTER TABLE bookings 
        DROP CONSTRAINT IF EXISTS bookings_status_check;
      `);
    }
    
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
    
    return true;
  } catch (error) {
    if (error.message.includes('already exists') || error.code === '42710') {
      console.log('⚠️  Constraint already exists with correct values, skipping migration');
      return true;
    }
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
updateBookingStatusConstraint()
  .then(() => {
    console.log('Migration process completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration process failed:', err);
    process.exit(1);
  });
