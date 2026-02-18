const pool = require('../../lib/db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  // Handle GET request - get single order
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  // Handle PUT request - update order status
  if (req.method === 'PUT') {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const result = await pool.query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, orderId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json({ success: true, order: result.rows[0] });
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
