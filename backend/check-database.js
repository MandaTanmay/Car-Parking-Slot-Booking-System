import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function checkDatabase() {
  const isProduction = DATABASE_URL && DATABASE_URL.includes('render.com');
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('📦 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Check parking_lots columns
    console.log('\n📊 Checking parking_lots table structure:');
    const lotsColumns = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'parking_lots'
      ORDER BY ordinal_position;
    `);
    console.log('Parking Lots Columns:');
    lotsColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    // Check bookings columns
    console.log('\n📊 Checking bookings table structure:');
    const bookingsColumns = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'bookings'
      ORDER BY ordinal_position;
    `);
    console.log('Bookings Columns:');
    bookingsColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    // Try to fetch parking lots
    console.log('\n📊 Testing parking lots query:');
    try {
      const result = await client.query(`
        SELECT pl.*, 
          COUNT(s.id) as total_slots,
          COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_slots
        FROM parking_lots pl
        LEFT JOIN slots s ON pl.id = s.parking_lot_id
        GROUP BY pl.id
        ORDER BY pl.created_at DESC
        LIMIT 1
      `);
      console.log('✅ Query successful, sample data:');
      if (result.rows.length > 0) {
        console.log(result.rows[0]);
      } else {
        console.log('No parking lots found');
      }
    } catch (error) {
      console.error('❌ Query failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

checkDatabase();
