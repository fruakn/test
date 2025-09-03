const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.PROXY_TOKEN || "secret-token";

app.get('/', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${TOKEN}`) return res.status(401).json({ error: "Unauthorized" });

    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: "Missing url param" });

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        res.send(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
