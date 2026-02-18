# Deployment Guide

## Quick Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Production Deploy:**
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/shoestore-website.git
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

## Deploy to GitHub Pages

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json scripts:**
```json
"scripts": {
  "predeploy": "echo 'Building...'",
  "deploy": "gh-pages -d ."
}
```

3. **Deploy:**
```bash
npm run deploy
```

4. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Select branch: gh-pages
   - Save

## Local Testing

### Using Node.js Server

```bash
npm install
npm start
```

Open: http://localhost:5000

### Using Python Flask

```bash
pip install -r requirements.txt
python backend.py
```

Open: http://localhost:5000

### Using Static Files Only

Simply open `index.html` in your browser. No server needed!

## Important Notes

### For Vercel Deployment:
- The website uses localStorage for data storage
- API routes are optional (for demo purposes)
- All core functionality works without a backend

### Environment Variables (Optional)
For API authentication, set these in Vercel:
```
ADMIN_EMAIL=moizshabbir2248@gmail.com
ADMIN_PASSWORD=your_secure_password
```

### Post-Deployment

1. **Test all pages:**
   - Home (index.html)
   - Products (products.html)
   - Cart (cart.html)
   - Payment (payment.html)
   - Contact (contact.html)
   - Admin Panel (mega_admin.html)

2. **Add initial products:**
   - Go to mega_admin.html
   - Navigate to "Add Product"
   - Add your products

3. **Configure payment details:**
   - Edit payment.html with your EasyPaisa/Meezan account details
   - Update WhatsApp number for order notifications

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Routes Not Working
- Check vercel.json configuration
- Ensure API files are in /api directory
- Check Vercel function logs in dashboard

### Static Files Not Loading
- Verify file paths are relative
- Check .vercelignore configuration
- Clear Vercel deployment cache

## Support

For help:
- Email: moizshabbir2248@gmail.com
- WhatsApp: 03322942248
