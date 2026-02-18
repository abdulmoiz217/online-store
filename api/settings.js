// Enable CORS header
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Store settings (in production, use a database)
let settings = {
    name: "ShoeStore",
    address: "Punjabi Club Kharader Custom House Karachi",
    contact: "03322942248",
    email: "moizshabbir2248@gmail.com"
};

module.exports = function handler(req, res) {
    setCorsHeaders(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle GET request - get settings
    if (req.method === 'GET') {
        return res.status(200).json(settings);
    }

    // Handle POST request - update settings
    if (req.method === 'POST') {
        settings = { ...settings, ...req.body };
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
};
