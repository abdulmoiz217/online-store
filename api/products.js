const pool = require('../lib/db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request - get all products
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC'
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // Handle POST request - add new product
  if (req.method === 'POST') {
    try {
      const { name, price, category, image, description, sold } = req.body;

      // Validation
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields: name, price, category' });
      }

      const result = await pool.query(
        `INSERT INTO products (name, price, category, image, description, sold)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          name,
          parseFloat(price),
          category,
          image || `https://via.placeholder.com/250x250?text=${encodeURIComponent(name)}`,
          description || '',
          sold || false
        ]
      );

      return res.status(201).json({ success: true, product: result.rows[0] });
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ error: 'Failed to add product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
