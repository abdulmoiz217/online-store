# 🚀 Neon DB Integration - Setup & Deployment Guide

## 📋 Overview

Your ShoeStore website is now fully integrated with **Neon DB (PostgreSQL)** backend! All products and orders are stored in a real database and accessible globally to all users.

---

## 🔧 What's New

### ✅ Features Implemented:

1. **Neon DB Database** - PostgreSQL serverless database
2. **API Endpoints** - Full CRUD operations for products and orders
3. **Admin Panel** - Now uses database instead of localStorage
4. **Checkout** - Orders saved to database
5. **Product Display** - Products fetched from database
6. **Settings** - Store settings saved to database

### 📁 New/Updated Files:

```
shoestore-website/
├── api/
│   ├── lib/
│   │   └── db.js              ✅ NEW - Database connection
│   ├── products.js            ✅ UPDATED - Products API
│   ├── products/[id].js       ✅ UPDATED - Single product API
│   ├── orders.js              ✅ UPDATED - Orders API
│   ├── orders/[id].js         ✅ UPDATED - Single order API
│   └── settings.js            ✅ UPDATED - Settings API
├── scripts/
│   └── setup-database.js      ✅ NEW - Database setup script
├── script.js                  ✅ UPDATED - Fetches products from API
├── mega_admin.html            ✅ UPDATED - Uses API for all operations
├── payment.html               ✅ UPDATED - Saves orders to API
├── admin-api-integration.js   ✅ NEW - Admin panel API integration
├── package.json               ✅ UPDATED - Added dependencies
└── .env.example               ✅ NEW - Environment variables template
```

---

## 🌍 Environment Variables Setup

### Step 1: Create .env File

Create a `.env` file in your project root:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_6oYC3HQuvwyr@ep-soft-poetry-aiictqbu-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
NODE_ENV="production"
```

### Step 2: Set Environment Variables on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_6oYC3HQuvwyr@ep-soft-poetry-aiictqbu-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

5. Click **Save**

---

## 🗄️ Database Setup

### Option 1: Automatic Setup (Recommended)

When you deploy to Vercel, the database tables will be created automatically on first API call.

### Option 2: Manual Setup

Run the setup script locally:

```bash
# Install dependencies first
npm install

# Run database setup
npm run setup-db
```

This will create:
- `products` table
- `orders` table
- `settings` table
- Performance indexes

### Database Schema:

**Products Table:**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image TEXT,
  sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Orders Table:**
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

**Settings Table:**
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

## 📡 API Endpoints

### Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/products` | Add new product |
| `GET` | `/api/products/:id` | Get single product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |

### Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get all orders |
| `POST` | `/api/orders` | Place new order |
| `GET` | `/api/orders/:id` | Get single order |
| `PUT` | `/api/orders/:id` | Update order status |

### Settings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Get store settings |
| `POST` | `/api/settings` | Update store settings |

---

## 🚀 Deployment to Vercel

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Neon DB integration - Full stack e-commerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shoestore-neon.git
git push -u origin main
```

### Step 3: Deploy to Vercel

**Option A - Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option B - Vercel Website:**

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Add environment variables (see above)
5. Click **Deploy**

### Step 4: Verify Deployment

After deployment:

1. Open your Vercel URL
2. Go to `/mega_admin.html`
3. Add a test product
4. Check if it appears on `/products.html`
5. Place a test order
6. Check if it appears in admin panel

---

## 🧪 Local Development

### Run Local Server

```bash
# Install dependencies
npm install

# Start local server
npm start
```

Open: `http://localhost:3000`

### Test API Endpoints

```bash
# Get all products
curl http://localhost:3000/api/products

# Add a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Shoe","price":2999,"category":"sports","description":"Test product"}'

# Get all orders
curl http://localhost:3000/api/orders
```

---

## 🔄 Data Migration (Optional)

If you have existing data in localStorage that you want to migrate to the database:

### Migration Script:

```javascript
// Run this in browser console on admin panel
async function migrateToDatabase() {
  // Migrate products
  const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
  for (const product of localProducts) {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        sold: product.sold
      })
    });
  }
  console.log(`Migrated ${localProducts.length} products`);
  
  // Migrate orders
  const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  for (const order of localOrders) {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
  }
  console.log(`Migrated ${localOrders.length} orders`);
}

// Run migration
migrateToDatabase();
```

---

## 🛠️ Troubleshooting

### Error: "Failed to fetch products"

**Solution:**
- Check if `DATABASE_URL` is set in Vercel environment variables
- Verify database connection in Vercel function logs
- Ensure SSL mode is set to `require`

### Error: "relation does not exist"

**Solution:**
- Run the database setup script: `npm run setup-db`
- Check Vercel function logs for setup errors

### Products not showing after adding

**Solution:**
- Check browser console for errors
- Verify API endpoint is responding
- Check Vercel function logs
- Clear browser cache

### Orders not saving

**Solution:**
- Check network tab in browser DevTools
- Verify order data format is correct
- Check Vercel function logs for errors

---

## 📊 Database Management

### View Data in Neon Console

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Open **SQL Editor**
4. Run queries:

```sql
-- View all products
SELECT * FROM products ORDER BY created_at DESC;

-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View pending orders
SELECT * FROM orders WHERE status = 'pending_verification';

-- Count sold products
SELECT COUNT(*) FROM products WHERE sold = true;
```

### Backup Data

```bash
# Export all data
npm run export-data
```

Or use the **Export** feature in Admin Panel (`/mega_admin.html` → Backup & Export)

---

## ✅ Final Checklist

- [ ] `.env` file created with `DATABASE_URL`
- [ ] Environment variables set on Vercel
- [ ] Dependencies installed (`npm install`)
- [ ] Database tables created (auto or manual)
- [ ] Deployed to Vercel
- [ ] Test product added successfully
- [ ] Test order placed successfully
- [ ] Admin panel shows database data
- [ ] All API endpoints working

---

## 🎉 You're All Set!

Your ShoeStore is now a **fully functional full-stack application** with:

- ✅ Real PostgreSQL database (Neon DB)
- ✅ Serverless API on Vercel
- ✅ Global data synchronization
- ✅ Admin panel with database integration
- ✅ Order management system
- ✅ Store settings management

**Happy Selling!** 🚀

---

## 📞 Support

For issues or questions:
- Check Vercel function logs
- Check Neon Console for database queries
- Email: moizshabbir2248@gmail.com
- WhatsApp: 03322942248
