# 🚀 Neon DB REST API Integration - Complete Guide

## ✅ What's Been Done

Your static ShoeStore website is now **fully integrated with Neon DB REST API**! All products and orders are stored in your Neon database and accessible globally.

---

## 📁 Files Created/Updated

### New Files:
1. ✅ `neon-api.js` - API helper functions for all pages
2. ✅ `admin-neon-integration.js` - Admin panel CRUD operations

### Updated Files:
1. ✅ `script.js` - Fetches products from Neon DB
2. ✅ `products.html` - Includes Neon API integration
3. ✅ `mega_admin.html` - Full database CRUD
4. ✅ `payment.html` - Saves orders to Neon DB

---

## 🗄️ Database Schema

Your Neon DB should have these tables:

### Products Table:
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image TEXT,
  sold BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table:
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  customer_info JSONB NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  verification JSONB,
  status VARCHAR(50) DEFAULT 'pending_verification',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Settings Table:
```sql
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) DEFAULT 'ShoeStore',
  address TEXT,
  contact VARCHAR(50),
  email VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Setup Instructions

### Step 1: Create Tables in Neon DB

Go to [Neon Console](https://console.neon.tech) and run these SQL commands:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image TEXT,
  sold BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
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
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) DEFAULT 'ShoeStore',
  address TEXT,
  contact VARCHAR(50),
  email VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (store_name, address, contact, email)
VALUES ('ShoeStore', 'Punjabi Club Kharader Custom House Karachi', '03322942248', 'moizshabbir2248@gmail.com')
ON CONFLICT DO NOTHING;
```

### Step 2: Enable Row Level Security (Optional but Recommended)

```sql
-- Allow public read access (for products)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Allow public insert/update for orders (checkout)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);

-- Allow public read/write for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON settings FOR ALL USING (true);
```

---

## 🎯 How It Works

### Products Page (`products.html`):

```javascript
// Automatically fetches from Neon DB when page loads
await fetchProducts(); // From neon-api.js

// Displays products in grid
products.forEach(product => {
  // Create product card
  // Show name, price, image, "Add to Cart" button
});
```

### Admin Panel (`mega_admin.html`):

```javascript
// Add product
await addProduct({ name, price, category, description, image, stock });

// Update product
await updateProduct(id, { name, price, sold, stock });

// Delete product
await deleteProduct(id);

// View orders
await fetchOrders();

// Update order status
await updateOrderStatus(orderId, 'approved');
```

### Checkout (`payment.html`):

```javascript
// Save order to Neon DB
await placeOrder({
  items: cart,
  total: totalAmount,
  customer_info: customerData,
  payment_method: 'easypaisa',
  verification: screenshotData
});
```

---

## 📡 API Endpoints Used

All API calls use your Neon DB REST API:

```
Base URL: https://ep-soft-poetry-aiictqbu.apirest.c-4.us-east-1.aws.neon.tech/neondb/rest/v1

Products:
  GET    /products              - Fetch all products
  POST   /products              - Add new product
  PATCH  /products?id=eq.{id}   - Update product
  DELETE /products?id=eq.{id}   - Delete product

Orders:
  GET    /orders                - Fetch all orders
  POST   /orders                - Place new order
  PATCH  /orders?id=eq.{id}     - Update order status

Settings:
  GET    /settings?limit=1      - Get store settings
  POST   /settings              - Insert settings
  PATCH  /settings?id=eq.{id}   - Update settings
```

---

## ✅ Testing Your Integration

### Test 1: Add Product from Admin Panel

1. Open `/mega_admin.html`
2. Go to "Add Product" section
3. Fill in:
   - Name: "Test Shoe"
   - Price: 2999
   - Category: "sports"
   - Description: "Test product"
4. Click "Add Product"
5. **Expected:** Product added successfully, shows in list

### Test 2: View Products on Products Page

1. Open `/products.html`
2. **Expected:** Your test product appears in the grid
3. No page refresh needed - it fetches from database!

### Test 3: Place Order

1. Add product to cart
2. Go to checkout (`/payment.html`)
3. Fill in customer info
4. Select payment method
5. Complete order
6. **Expected:** Order saved to database

### Test 4: View Orders in Admin

1. Open `/mega_admin.html`
2. Go to "Manage Orders"
3. **Expected:** Your test order appears
4. Approve/reject order
5. **Expected:** Status updates in database

---

## 🔍 Troubleshooting

### Products Not Loading

**Check:**
1. Open browser console (F12)
2. Look for errors
3. Verify Neon DB URL is correct
4. Check if tables exist in database

**Solution:**
```javascript
// Test API connection in browser console
fetch('https://ep-soft-poetry-aiictqbu.apirest.c-4.us-east-1.aws.neon.tech/neondb/rest/v1/products')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### Can't Add Products

**Check:**
1. Browser console for errors
2. Network tab - check API response
3. Verify database permissions

**Solution:**
```sql
-- Grant permissions if needed
GRANT ALL ON products TO neondb_owner;
GRANT ALL ON orders TO neondb_owner;
GRANT ALL ON settings TO neondb_owner;
```

### Orders Not Saving

**Check:**
1. Verify customer_info is valid JSON
2. Check total is a number
3. Verify payment_method is set

---

## 🎨 Customization

### Change API Base URL

Edit `neon-api.js`:

```javascript
const NEON_API_BASE = 'YOUR_NEON_DB_REST_URL';
```

### Add More Product Fields

Edit the `addProduct()` function in `neon-api.js`:

```javascript
async function addProduct(productData) {
  // Add more fields
  body: JSON.stringify({
    name: productData.name,
    price: productData.price,
    category: productData.category,
    description: productData.description,
    image: productData.image,
    sold: false,
    stock: productData.stock,
    // Add your custom fields here
    color: productData.color,
    size: productData.size
  })
}
```

---

## 📊 Monitor Your Database

### View Data in Neon Console:

```sql
-- View all products
SELECT * FROM products ORDER BY created_at DESC;

-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View pending orders
SELECT * FROM orders WHERE status = 'pending_verification';

-- Count sold products
SELECT COUNT(*) FROM products WHERE sold = true;

-- Total revenue from approved orders
SELECT SUM(total) FROM orders WHERE status = 'approved';
```

---

## 🎉 Success Indicators

✅ Products load from database on products page  
✅ Admin panel can add/edit/delete products  
✅ Changes reflect immediately (no redeploy needed)  
✅ Orders save to database on checkout  
✅ Admin can view/update order status  
✅ No localStorage dependency for products/orders  

---

## 📞 Support

**Contact:**
- Email: moizshabbir2248@gmail.com
- WhatsApp: 03322942248

**Resources:**
- [Neon DB Docs](https://neon.tech/docs)
- [PostgREST Docs](https://postgrest.org)

---

**Ab aapki website 100% dynamic hai! Admin panel se products add karein aur wo turant products page par dikhenge!** 🚀
