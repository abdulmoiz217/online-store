const { Pool } = require('pg');
require('dotenv').config();

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Database setup script
async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Setting up database schema...');
    
    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        image TEXT,
        sold BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created');
    
    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        customer_info JSONB NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        verification JSONB,
        status VARCHAR(50) DEFAULT 'pending_verification',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Orders table created');
    
    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        store_name VARCHAR(255) DEFAULT 'ShoeStore',
        address TEXT,
        contact VARCHAR(50),
        email VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Settings table created');
    
    // Insert default settings if not exists
    await client.query(`
      INSERT INTO settings (store_name, address, contact, email)
      SELECT 'ShoeStore', 'Punjabi Club Kharader Custom House Karachi', '03322942248', 'moizshabbir2248@gmail.com'
      WHERE NOT EXISTS (SELECT 1 FROM settings)
    `);
    console.log('✅ Default settings inserted');
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_sold ON products(sold);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    `);
    console.log('✅ Indexes created');
    
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error.message);
    process.exit(1);
  });
