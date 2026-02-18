const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to Neon DB');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

module.exports = pool;
