const pool = require('../../lib/db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  // Handle GET request - get single product
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [productId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  // Handle PUT request - update product
  if (req.method === 'PUT') {
    try {
      const { name, price, category, image, description, sold } = req.body;

      // Validation
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields: name, price, category' });
      }

      const result = await pool.query(
        `UPDATE products 
         SET name = $1, price = $2, category = $3, image = $4, description = $5, sold = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [name, parseFloat(price), category, image, description, sold, productId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ success: true, product: result.rows[0] });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }
  }

  // Handle DELETE request - delete product
  if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1',
        [productId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
