# ShoeStore - Online Shoe Store Website

A modern, responsive online shoe store website with an admin panel for managing products, orders, and customer carts.

## Features

- 🛍️ **Product Catalog** - Browse shoes by category with filtering options
- 🛒 **Shopping Cart** - Add items to cart and manage quantities
- 💳 **Checkout System** - Secure checkout with EasyPaisa and Meezan Bank payment options
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔐 **Admin Panel** - Manage products, view orders, and track sales
- 📊 **Order Management** - Approve/reject orders with payment verification
- 💾 **Local Storage** - All data stored in browser localStorage (no database required)

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend (Optional):** Node.js/Express or Python/Flask (for local development)
- **Deployment:** Vercel (serverless), GitHub Pages, or any static hosting
- **Storage:** Browser localStorage (client-side)

## Project Structure

```
shoestore-website/
├── index.html          # Home page
├── products.html       # Products catalog
├── cart.html           # Shopping cart
├── payment.html        # Checkout page
├── contact.html        # Contact page
├── mega_admin.html     # Admin panel
├── reset_products.html # Reset products utility
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript
├── sync_script.js      # Real-time sync script
├── server.js           # Node.js server (optional)
├── backend.py          # Python Flask backend (optional)
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel deployment config
└── api/                # Vercel serverless functions (optional)
```

## Local Development

### Option 1: Using Node.js

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open browser to `http://localhost:5000`

### Option 2: Using Python Flask

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
python backend.py
```

3. Open browser to `http://localhost:5000`

### Option 3: Static Files Only

Simply open `index.html` in your browser. No server required!

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy using CLI:**
```bash
vercel
```

3. **Or deploy via GitHub:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect and deploy

### Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the repository
3. Go to Settings > Pages
4. Select branch (main/master) and save
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Deploy to Other Static Hosts

The website is fully static and can be deployed to any static hosting service:
- Netlify
- Cloudflare Pages
- Firebase Hosting
- AWS S3 + CloudFront

## Admin Panel

Access the admin panel by navigating to `mega_admin.html`

### Default Admin Credentials (for API-based deployment)
- **Email:** moizshabbir2248@gmail.com
- **Password:** abdulmoiz217

> ⚠️ **Note:** In the localStorage-only version, authentication is bypassed for simplicity. For production use, implement proper authentication.

### Admin Features

- **Dashboard:** View statistics (total products, carts, revenue, orders)
- **Add Product:** Add new products with images
- **Manage Products:** Edit, delete, or mark products as sold
- **View Carts:** See all active customer carts
- **Manage Orders:** Approve/reject orders with payment verification
- **Store Settings:** Update store name, address, contact info
- **Backup/Export:** Export data as JSON files
- **Reset Data:** Clear all products, carts, or everything

## Payment Methods

The website supports:
- **EasyPaisa** - Mobile wallet payment
- **Meezan Bank** - Bank transfer
- **Cash on Delivery** - Pay on delivery (optional)

Customers upload payment screenshots for verification. Admin can approve/reject orders from the admin panel.

## Currency

- Prices are displayed in **Pakistani Rupees (PKR)**
- Default conversion rate: 1 USD = 300 PKR (adjustable in `script.js`)
- Shipping cost: Rs 500 (adjustable in `script.js`)

## Customization

### Change Store Information

1. Go to Admin Panel (`mega_admin.html`)
2. Navigate to "Store Settings"
3. Update name, address, contact, and email
4. Click "Save Settings"

### Add Default Products

Products can be added via the Admin Panel. They will be stored in localStorage.

### Change Payment Account Details

Edit the account details in `payment.html`:
- EasyPaisa: Line ~330 (account number and name)
- Meezan Bank: Line ~360 (account number and name)

### Change WhatsApp Number

Update the WhatsApp number in:
- `payment.html` - Line ~400
- `contact.html` - Line ~60
- `index.html` - Contact section

## Important Notes

1. **Data Persistence:** All data is stored in browser localStorage. Clearing browser data will delete all products, orders, and settings.

2. **Multi-Device:** Data does not sync across devices. Each browser has its own localStorage.

3. **Production Use:** For a production e-commerce site, consider:
   - Implementing a real database (MongoDB, PostgreSQL, etc.)
   - Adding proper user authentication
   - Using a secure payment gateway
   - Implementing server-side validation

4. **Privacy:** Customer payment screenshots are stored in localStorage. For production, use secure cloud storage.

## Troubleshooting

### Products not showing
- Clear browser cache and reload
- Check browser console for errors
- Ensure JavaScript is enabled

### Cart not updating
- Clear localStorage: `localStorage.clear()` in browser console
- Check browser console for errors

### Admin panel not loading orders
- Orders are stored in localStorage under key 'orders'
- Check browser DevTools > Application > Local Storage

## Support

For issues or questions:
- Email: moizshabbir2248@gmail.com
- WhatsApp: 03322942248

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ for ShoeStore**
