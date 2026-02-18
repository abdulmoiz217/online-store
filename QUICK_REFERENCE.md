# ⚡ Quick Reference - Neon DB Integration

## 🎯 Copy-Paste Code Snippets

### For products.html - Just add these scripts before closing `</body>`:

```html
<!-- Neon DB API Integration -->
<script src="neon-api.js"></script>
<script src="script.js"></script>
```

### For mega_admin.html - Add before closing `</body>`:

```html
<!-- Neon DB Integration -->
<script src="neon-api.js"></script>
<script src="admin-neon-integration.js"></script>
```

### For payment.html - Add before closing `</body>`:

```html
<!-- Neon DB API -->
<script src="neon-api.js"></script>
```

---

## 📡 API Functions Reference

### Products:
```javascript
// Get all products
const products = await fetchProducts();

// Add product
await addProduct({
  name: 'Shoe Name',
  price: 2999,
  category: 'sports',
  description: 'Description',
  image: 'https://image-url.com/image.jpg',
  stock: 100
});

// Update product
await updateProduct(id, {
  name: 'Updated Name',
  price: 3499,
  sold: false
});

// Delete product
await deleteProduct(id);

// Toggle sold status
await toggleProductSold(id, currentStatus);
```

### Orders:
```javascript
// Get all orders
const orders = await fetchOrders();

// Place order
await placeOrder({
  items: cartItems,
  total: 5999,
  customer_info: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '03001234567',
    address: '123 Street',
    city: 'Karachi'
  },
  payment_method: 'easypaisa',
  verification: { transactionId: '12345', screenshot: 'base64...' }
});

// Update order status
await updateOrderStatus(orderId, 'approved');
```

### Settings:
```javascript
// Get settings
const settings = await fetchSettings();

// Update settings
await updateSettings({
  store_name: 'My Store',
  address: 'My Address',
  contact: '03001234567',
  email: 'store@example.com'
});
```

---

## 🗄️ Database Setup SQL

Run this in Neon Console:

```sql
-- Products table
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

-- Orders table
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

-- Settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) DEFAULT 'ShoeStore',
  address TEXT,
  contact VARCHAR(50),
  email VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default settings
INSERT INTO settings (store_name, address, contact, email)
VALUES ('ShoeStore', 'Punjabi Club Kharader Custom House Karachi', '03322942248', 'moizshabbir2248@gmail.com')
ON CONFLICT DO NOTHING;
```

---

## ✅ Testing Checklist

```
□ Database tables created
□ Run: Open products.html - products should load
□ Run: Open mega_admin.html - add a product
□ Run: Refresh products.html - new product appears
□ Run: Add to cart and checkout
□ Run: Check mega_admin.html - order appears
□ Run: Approve order - status updates
```

---

## 🛠️ Common Issues & Solutions

### Issue: "Failed to fetch products"
**Solution:** Check if tables exist in Neon DB

### Issue: "Cannot add product"
**Solution:** Verify all required fields (name, price, category)

### Issue: "Products not showing after add"
**Solution:** Refresh page or call `await loadProducts()`

### Issue: "Order not saving"
**Solution:** Check customer_info is valid JSON object

---

## 📊 Useful SQL Queries

```sql
-- Get all products
SELECT * FROM products;

-- Get available products
SELECT * FROM products WHERE sold = false;

-- Get pending orders
SELECT * FROM orders WHERE status = 'pending_verification';

-- Get total revenue
SELECT SUM(total) FROM orders WHERE status = 'approved';

-- Count products by category
SELECT category, COUNT(*) FROM products GROUP BY category;

-- Delete all products (CAREFUL!)
DELETE FROM products;

-- Delete all orders (CAREFUL!)
DELETE FROM orders;
```

---

## 🎯 File Structure

```
your-project/
├── neon-api.js              ← Main API functions
├── admin-neon-integration.js ← Admin panel logic
├── script.js                ← Frontend product loading
├── products.html            ← Fetches products
├── mega_admin.html          ← Full CRUD
└── payment.html             ← Saves orders
```

---

## 🚀 Deploy to Vercel

```bash
# Just push to Git and Vercel auto-deploys
git add .
git commit -m "Neon DB integration"
git push

# No build step needed - it's static HTML + JS!
```

---

**That's it! Your website is now fully dynamic with Neon DB!** 🎉

**Questions? Check `NEON_API_SETUP.md` for detailed guide.**
