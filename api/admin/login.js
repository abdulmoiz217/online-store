// Enable CORS header
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = function handler(req, res) {
    setCorsHeaders(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle POST request - admin login
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // In production, use environment variables and proper authentication
        if (username === "moizshabbir2248@gmail.com" && password === "abdulmoiz217") {
            return res.status(200).json({ success: true, token: "fake-jwt-token" });
        } else {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
};
