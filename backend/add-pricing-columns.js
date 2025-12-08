import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function addPricingColumns() {
  const isProduction = DATABASE_URL && DATABASE_URL.includes('render.com');
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('📦 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    console.log('📝 Adding hourly_rate column to parking_lots...');
    await client.query(`
      ALTER TABLE parking_lots 
      ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2) DEFAULT 50.00
    `);
    console.log('✅ hourly_rate column added');

    console.log('📝 Adding total_amount column to bookings...');
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2)
    `);
    console.log('✅ total_amount column added');

    console.log('📝 Updating existing parking lots with default rate...');
    await client.query(`
      UPDATE parking_lots 
      SET hourly_rate = 50.00 
      WHERE hourly_rate IS NULL
    `);
    console.log('✅ Parking lots updated');

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('✅ Database connection closed');
  }
}

addPricingColumns();
