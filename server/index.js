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

// 1. SAIF API KEY 
const API_KEY = "your_real_serpapi_key_here"; 

// 2. SAIF MONGODB CONNECTION
const DB_URI ="your_real_mongodb_connection_string_here";

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

      // --- NEW LINK SEARCH LOGIC ---
      // 1. the direct link if SerpApi parsed it
      // 2. Otherwise use the standard link (which is a redirect to the store)
      // 3. Fallback to the 'inline' link if available
      // 4. AVOID 'product_link' unless it's the only option (that's the Google page)
      let bestLink = item.direct_link || item.link;

      // If the link looks like a Google Shopping page (starts with /shopping/product), try to find a seller link
      if (!bestLink || bestLink.includes("google.com/shopping/product")) {
         if(item.inline_shopping_results && item.inline_shopping_results.length > 0) {
             bestLink = item.inline_shopping_results[0].link;
         } else {
             // Last resort
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

    if (SearchHistory && products.length > 0) {
        try {
            await SearchHistory.create({
                term: query,
                topResult: { title: products[0].title, price: products[0].price, image: products[0].image, source: products[0].source }
            });
        } catch (e) { console.log("History Error"); }
    }

    res.json(products);

  } catch (error) {
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: "Search failed." });
  }
});

// History Route
app.get('/api/history', async (req, res) => {
    try {
        if (!SearchHistory) return res.json([]);
        const history = await SearchHistory.find().sort({ searchDate: -1 }).limit(10);
        res.json(history);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});