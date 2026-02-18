const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit to handle base64 images
app.use(express.static('.')); // Serve static files from root

// In-memory storage
let products = [
    {
        id: 1,
        name: "Running Shoes",
        price: 89.99,
        category: "sports",
        image: "https://via.placeholder.com/250x250?text=Running+Shoes",
        description: "Lightweight running shoes for maximum comfort",
        sold: false
    },
    {
        id: 2,
        name: "Casual Sneakers",
        price: 59.99,
        category: "casual",
        image: "https://via.placeholder.com/250x250?text=Casual+Sneakers",
        description: "Stylish casual sneakers for everyday wear",
        sold: false
    }
];

let orders = [];
let settings = {
    name: "ShoeStore",
    address: "Punjabi Club Kharader Custom House Karachi",
    contact: "03322942248",
    email: "moizshabbir2248@gmail.com"
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

// API routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/cart', (req, res) => {
    // For simplicity, we're not storing cart server-side
    // In a real app, you would store this in a database
    res.json({ success: true });
});

app.get('/api/cart', (req, res) => {
    // For simplicity, returning empty cart
    // In a real app, you would retrieve from database
    res.json([]);
});

// Admin API routes
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === "moizshabbir2248@gmail.com" && password === "abdulmoiz217") {
        res.json({ success: true, token: "fake-jwt-token" });
    } else {
        res.status(401).json({ success: false, error: "Invalid credentials" });
    }
});

app.get('/api/admin/products', (req, res) => {
    res.json(products);
});

app.post('/api/admin/products', (req, res) => {
    const { name, price, category, image, description } = req.body;
    
    if (!name || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        category,
        image: image || `https://via.placeholder.com/250x250?text=${encodeURIComponent(name)}`,
        description,
        sold: false
    };
    
    products.push(newProduct);
    res.json({ success: true, id: newProduct.id });
});

app.put('/api/admin/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price, category, image, description, sold } = req.body;
    
    if (!name || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    products[productIndex] = {
        ...products[productIndex],
        name,
        price: parseFloat(price),
        category,
        image: image || products[productIndex].image,
        description,
        sold: typeof sold !== 'undefined' ? sold : products[productIndex].sold
    };
    
    res.json({ success: true });
});

app.delete('/api/admin/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    res.json({ success: true });
});

app.put('/api/admin/products/:id/toggle_sold', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    product.sold = !product.sold;
    res.json({ success: true, sold: product.sold });
});

// Settings API
app.get('/api/settings', (req, res) => {
    res.json(settings);
});

app.post('/api/settings', (req, res) => {
    settings = { ...settings, ...req.body };
    res.json({ success: true });
});


// Place order
app.post('/api/place_order', (req, res) => {
    const { items, total, customer_info, payment_method, verification } = req.body;

    const order = {
        id: orders.length + 1,
        items,
        total, // This should be in PKR
        customer_info,
        payment_method,
        verification, // Store verification data (transaction ID and screenshot)
        date: new Date().toISOString(),
        status: "pending_verification" // New status for pending verification
    };

    orders.push(order);

    res.json({ success: true, order_id: order.id });
});

// Get all orders (for admin panel)
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Update order status (for admin panel)
app.put('/api/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    // If approved, you might want to send a notification to the customer
    if (status === 'approved') {
        // In a real app, you would send an email/SMS notification here
        console.log(`Order ${orderId} approved for customer ${order.customer_info.email}`);
    }

    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});