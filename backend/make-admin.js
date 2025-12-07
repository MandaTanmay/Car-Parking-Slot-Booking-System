// Script to make a user admin by email
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const email = process.argv[2];

if (!email) {
  console.error('Usage: node make-admin.js <email>');
  process.exit(1);
}

pool.query(
  'UPDATE users SET role = $1 WHERE email = $2 RETURNING *',
  ['admin', email]
).then(result => {
  if (result.rows.length === 0) {
    console.error(`User with email '${email}' not found`);
  } else {
    console.log('User updated to admin:');
    console.log({
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
    });
  }
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
