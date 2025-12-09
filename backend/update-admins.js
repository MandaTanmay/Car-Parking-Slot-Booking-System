import dotenv from 'dotenv';
import { query } from './src/db.js';

dotenv.config();

async function updateAdmins() {
  try {
    // First, check if admintanmay@gmail.com exists
    const checkUser = await query(
      'SELECT id, name, email, role FROM users WHERE email = $1',
      ['admintanmay@gmail.com']
    );

    if (checkUser.rows.length === 0) {
      console.log('admintanmay@gmail.com not found in database');
      console.log('\nLet me check all users:');
      const allUsers = await query('SELECT id, name, email, role FROM users ORDER BY created_at DESC LIMIT 5');
      console.log('Recent users:', allUsers.rows);
      return;
    }

    // Promote admintanmay@gmail.com to admin
    const promoteResult = await query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, name, email, role',
      ['admin', 'admintanmay@gmail.com']
    );
    console.log('✅ Promoted to admin:', promoteResult.rows[0]);

    console.log('\n✅ Admin accounts updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdmins();
