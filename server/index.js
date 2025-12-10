// server/index.js (Bulletproof Version)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); // Using axios is more stable than the serpapi library

// Try to import the model, but don't crash if it's missing
let SearchHistory;
try {
    SearchHistory = require('./models/SearchHistory');
} catch (e) {
    console.log("⚠️ Could not find SearchHistory model. History feature will be disabled.");
}

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---

// 1. YOUR API KEY (Paste it here)
const API_KEY = "5e6031d7c06842b2fdfe4e29747ee8e2de5f09a8f0bd3eef2d114fa4807b8cd8"; 

// 2. YOUR MONGODB CONNECTION
const DB_URI ="mongodb+srv://rexop_db_user:LtnbxRtflO2ZF7i3@cluster0.gwvcq2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// --- DATABASE CONNECTION ---
mongoose.connect(DB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

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

// --- SEARCH ROUTE (Updated to use AXIOS) ---
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  console.log(`🔎 Searching for: ${query}...`);

  try {
    // We use AXIOS directly to prevent timeouts from crashing the server
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

    if (!json.shopping_results) {
        return res.status(500).json({ error: "No results found" });
    }

    const products = json.shopping_results.map(item => {
      const currentPrice = item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0;
      let dealRating = "Fair Price";
      if (item.extracted_price < item.old_price) dealRating = "Great Deal";

      const bestLink = item.link || item.product_link;

      return {
        title: item.title,
        price: item.price,
        raw_price: currentPrice,
        image: item.thumbnail,
        link: bestLink, // <--- This uses the backup if needed!
        source: item.source,
        deal_rating: dealRating,
        history: generateHistory(currentPrice)
      };
    });
    
    // Save to History (if model exists)
    if (SearchHistory && products.length > 0) {
        const bestItem = products[0];
        try {
            await SearchHistory.create({
                term: query,
                topResult: {
                    title: bestItem.title,
                    price: bestItem.price,
                    image: bestItem.image,
                    source: bestItem.source
                }
            });
            console.log("💾 Saved to History");
        } catch (e) {
            console.log("Warning: Could not save history:", e.message);
        }
    }

    res.json(products);

  } catch (error) {
    // This catches the timeout WITHOUT crashing the server
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: "Search failed or timed out. Please try again." });
  }
});

// History Route
app.get('/api/history', async (req, res) => {
    try {
        if (!SearchHistory) return res.json([]);
        console.log("📖 Fetching history...");
        const history = await SearchHistory.find().sort({ searchDate: -1 }).limit(10);
        res.json(history);
    } catch (err) {
        console.error("❌ HISTORY ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});