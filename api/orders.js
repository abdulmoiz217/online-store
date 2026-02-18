// Enable CORS header
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// In-memory storage for orders
let orders = [];

module.exports = function handler(req, res) {
    setCorsHeaders(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle GET request - get all orders
    if (req.method === 'GET') {
        return res.status(200).json(orders);
    }

    // Handle POST request - place new order
    if (req.method === 'POST') {
        const { items, total, customer_info, payment_method, verification } = req.body;

        const order = {
            id: orders.length + 1,
            items,
            total,
            customer_info,
            payment_method,
            verification,
            date: new Date().toISOString(),
            status: "pending_verification"
        };

        orders.push(order);
        return res.status(200).json({ success: true, order_id: order.id });
    }

    return res.status(405).json({ error: "Method not allowed" });
};
