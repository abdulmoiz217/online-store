// Enable CORS header
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// In-memory storage for orders
let orders = [];

module.exports = function handler(req, res) {
    setCorsHeaders(res);

    const { id } = req.query;
    const orderId = parseInt(id);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Find the order
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    // Handle GET request - get single order
    if (req.method === 'GET') {
        return res.status(200).json(order);
    }

    // Handle PUT request - update order status
    if (req.method === 'PUT') {
        const { status } = req.body;
        order.status = status;
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
};
