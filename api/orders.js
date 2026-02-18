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

  // Handle GET request - get all orders
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM orders ORDER BY created_at DESC'
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Handle POST request - place new order
  if (req.method === 'POST') {
    try {
      const { items, total, customer_info, payment_method, verification } = req.body;

      // Validation
      if (!items || !total || !customer_info || !payment_method) {
        return res.status(400).json({ 
          error: 'Missing required fields: items, total, customer_info, payment_method' 
        });
      }

      const result = await pool.query(
        `INSERT INTO orders (items, total, customer_info, payment_method, verification, status)
         VALUES ($1, $2, $3, $4, $5, 'pending_verification')
         RETURNING *`,
        [
          JSON.stringify(items),
          parseFloat(total),
          JSON.stringify(customer_info),
          payment_method,
          verification ? JSON.stringify(verification) : null
        ]
      );

      return res.status(201).json({ success: true, order: result.rows[0] });
    } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ error: 'Failed to place order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
