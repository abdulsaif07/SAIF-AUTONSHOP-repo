// server/index.js (Refactored Version)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/alerts', require('./routes/alerts'));

// --- CONFIGURATION ---
const API_KEY = process.env.SERPAPI_KEY || "your_real_serpapi_key_here";
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/autonshop_dummy";

// --- DATABASE CONNECTION ---
mongoose.connect(DB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Helper for chart
const generateHistory = (currentPrice) => {
  const history = [];
  for (let i = 30; i > 0; i--) {
    const variation = (Math.random() * 0.1) - 0.05; 
    const price = Math.round(currentPrice * (1 + variation));
    history.push({ day: `Day ${i}`, price });
  }
  return history;
};

// --- SMART LINK CLEANER ---
function extractProductFromUrl(input) {
    if (!input.includes('http') && !input.includes('www.')) return input;
    try {
        const url = new URL(input.startsWith('http') ? input : `https://${input}`);
        const path = url.pathname;
        if (url.hostname.includes('amazon')) {
            const segments = path.split('/');
            const dpIndex = segments.indexOf('dp');
            if (dpIndex > 0) return segments[dpIndex - 1].replace(/-/g, ' ');
        }
        if (url.hostname.includes('flipkart')) {
            const segments = path.split('/');
            if (segments.length > 1) return segments[1].replace(/-/g, ' ');
        }
        return input;
    } catch (e) { return input; }
}

// --- SEARCH ROUTE ---
app.get('/api/search', async (req, res) => {
  let query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  query = extractProductFromUrl(query);
  console.log(`🔎 Searching for: ${query}...`);

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
        params: {
            engine: "google_shopping",
            q: query,
            location: "India",
            gl: "in",
            currency: "INR",
            api_key: API_KEY
        }
    });

    const json = response.data;
    if (!json.shopping_results) return res.status(500).json({ error: "No results found" });

    const products = json.shopping_results.map(item => {
      const currentPrice = item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0;
      let dealRating = "Fair Price";
      if (item.extracted_price < item.old_price) dealRating = "Great Deal";

      let bestLink = item.direct_link || item.link;

      if (!bestLink || bestLink.includes("google.com/shopping/product")) {
         if(item.inline_shopping_results && item.inline_shopping_results.length > 0) {
             bestLink = item.inline_shopping_results[0].link;
         } else {
             bestLink = item.link || item.product_link;
         }
      }

      return {
        title: item.title,
        price: item.price,
        raw_price: currentPrice,
        image: item.thumbnail,
        link: bestLink, 
        source: item.source,
        deal_rating: dealRating,
        history: generateHistory(currentPrice)
      };
    });

    res.json(products);
  } catch (error) {
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: "Search failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});