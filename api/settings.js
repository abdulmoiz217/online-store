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

  // Handle GET request - get settings
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM settings LIMIT 1');
      
      if (result.rows.length === 0) {
        // Return default settings if none exist
        return res.status(200).json({
          id: 1,
          store_name: 'ShoeStore',
          address: 'Punjabi Club Kharader Custom House Karachi',
          contact: '03322942248',
          email: 'moizshabbir2248@gmail.com'
        });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // Handle POST request - update settings
  if (req.method === 'POST') {
    try {
      const { store_name, address, contact, email } = req.body;

      // Check if settings exist
      const existing = await pool.query('SELECT id FROM settings LIMIT 1');
      
      let result;
      if (existing.rows.length === 0) {
        // Insert new settings
        result = await pool.query(
          `INSERT INTO settings (store_name, address, contact, email)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [
            store_name || 'ShoeStore',
            address || '',
            contact || '',
            email || ''
          ]
        );
      } else {
        // Update existing settings
        result = await pool.query(
          `UPDATE settings 
           SET store_name = $1, address = $2, contact = $3, email = $4, updated_at = CURRENT_TIMESTAMP
           WHERE id = (SELECT id FROM settings LIMIT 1)
           RETURNING *`,
          [
            store_name || 'ShoeStore',
            address || '',
            contact || '',
            email || ''
          ]
        );
      }

      return res.status(200).json({ success: true, settings: result.rows[0] });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
