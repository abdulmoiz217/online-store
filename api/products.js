// Enable CORS header
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// In-memory storage for products (for demo purposes)
// In production, you should use a database
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

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle GET request - return all products
    if (req.method === 'GET') {
        return res.status(200).json(products);
    }

    // Handle POST request - add new product
    if (req.method === 'POST') {
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
        return res.status(200).json({ success: true, id: newProduct.id });
    }

    return res.status(405).json({ error: "Method not allowed" });
};
