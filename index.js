// index.js
const express = require("express");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TOKEN || "secret-token";

app.use(express.json());

// Tüm istekleri yakala
app.all("*", async (req, res) => {
  console.log("Request received:", req.method, req.url); // LOG BURADA

  // Yetkilendirme kontrolü
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${TOKEN}`) {
    console.log("Unauthorized request blocked.");
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Hedef URL query parametresinden alınacak
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    console.log("Request success:", targetUrl);

    res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy fetch error:", error.message);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
