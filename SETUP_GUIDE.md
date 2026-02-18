# ShoeStore Website - Setup Instructions

## Quick Start (No Server Required!)

This website works entirely with localStorage. No backend needed!

### Option 1: Open Directly in Browser
1. Simply double-click `index.html`
2. Start browsing and adding products via Admin Panel

### Option 2: Use Live Server (Recommended for Development)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` and select "Open with Live Server"

## Admin Panel Setup

### Access Admin Panel
1. Open `mega_admin.html` in your browser
2. No login required for localStorage version!

### Add Your First Products
1. Click "Add Product" in the sidebar
2. Fill in:
   - Product Name
   - Price (in PKR)
   - Category
   - Description
   - Upload image (optional)
3. Click "Add Product"
4. Repeat for all products

### Manage Products
- **Mark as Sold:** Toggle product availability
- **Delete:** Remove products permanently
- **Edit:** Update product details

## Payment Setup

### Configure Payment Accounts
Edit `payment.html` and update:

**EasyPaisa (around line 330):**
```html
<div class="account-number">YOUR_EASYPAISA_NUMBER</div>
<div class="account-name">YOUR_NAME</div>
```

**Meezan Bank (around line 360):**
```html
<div class="account-number">YOUR_ACCOUNT_NUMBER</div>
<div class="account-name">YOUR_NAME</div>
```

### Update WhatsApp Number
Search for `wa.me/` in these files and replace with your number:
- `payment.html`
- `contact.html`
- `index.html`

## Store Customization

### Change Store Info
1. Open Admin Panel (`mega_admin.html`)
2. Go to "Store Settings"
3. Update:
   - Store Name
   - Address
   - Contact Number
   - Email
4. Click "Save Settings"

## Testing the Website

### Customer Journey
1. **Browse Products:** Go to `products.html`
2. **Add to Cart:** Click "Add to Cart" on any product
3. **View Cart:** Click "Cart" in navigation
4. **Checkout:** Click "Proceed to Checkout"
5. **Fill Information:** Enter customer details
6. **Select Payment:** Choose EasyPaisa or Meezan Bank
7. **Upload Proof:** Upload payment screenshot
8. **Place Order:** Submit order

### Admin Workflow
1. Open `mega_admin.html`
2. Go to "Manage Orders"
3. View pending orders
4. Check payment screenshots
5. Approve or Reject orders

## Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to GitHub Pages
1. Push code to GitHub
2. Go to Settings > Pages
3. Select main branch
4. Your site will be live

See `DEPLOYMENT.md` for detailed instructions.

## Data Storage

All data is stored in browser localStorage:
- **Products:** `localStorage.products`
- **Cart:** `localStorage.cart`
- **Orders:** `localStorage.orders`
- **Settings:** `localStorage.store-settings`

### Backup Data
1. Open Admin Panel
2. Go to "Backup & Export"
3. Click "Export All Data"

### Reset Data
1. Open Admin Panel
2. Go to "Reset Data"
3. Choose what to reset

## Troubleshooting

### Products Not Showing
- Clear browser cache
- Reload page (F5)
- Check browser console for errors

### Cart Not Working
- Ensure JavaScript is enabled
- Clear localStorage: Open console and type `localStorage.clear()`
- Reload page

### Orders Not Appearing in Admin
- Check that you're using the same browser
- Orders are stored per-browser
- Check console for errors

## File Structure

```
shoestore-website/
├── index.html           # Home page
├── products.html        # Products catalog
├── cart.html            # Shopping cart
├── payment.html         # Checkout
├── contact.html         # Contact page
├── mega_admin.html      # Admin panel
├── reset_products.html  # Reset utility
├── styles.css           # Styles
├── script.js            # Main JavaScript
├── sync_script.js       # Sync script
├── server.js            # Node.js server (optional)
├── backend.py           # Python server (optional)
├── vercel.json          # Vercel config
├── package.json         # Node.js config
└── requirements.txt     # Python dependencies
```

## Support

Need help?
- Email: moizshabbir2248@gmail.com
- WhatsApp: 03322942248

## Notes

⚠️ **Important:**
- Data is stored per browser/device
- Clearing browser data will delete all products/orders
- For multi-device sync, you need a backend database
- This version is perfect for single-store, single-device use
