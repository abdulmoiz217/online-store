// Enable CORS header
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// In-memory storage (for demo purposes - in production use a database)
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

module.exports = function handler(req, res) {
    setCorsHeaders(res);

    const { id } = req.query;
    const productId = parseInt(id);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle GET request - get single product
    if (req.method === 'GET') {
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
    }

    // Handle PUT request - update product
    if (req.method === 'PUT') {
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

        return res.status(200).json({ success: true });
    }

    // Handle DELETE request - delete product
    if (req.method === 'DELETE') {
        products = products.filter(p => p.id !== productId);
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
};
