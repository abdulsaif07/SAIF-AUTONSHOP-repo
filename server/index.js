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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const searchCache = new Map();

// Helper to check cache
const getFromCache = (key) => {
  const cached = searchCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }
  return null;
};

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
async function extractProductFromUrl(input) {
    if (!input.includes('http') && !input.includes('www.')) return input;
    try {
        let urlStr = input.startsWith('http') ? input : `https://${input}`;
        
        // Follow shortlinks
        if (urlStr.includes('amzn.in') || urlStr.includes('/d/') || urlStr.includes('/s/')) {
            try {
                const response = await axios.head(urlStr, { maxRedirects: 5, timeout: 3000 });
                if (response.request && response.request.res && response.request.res.responseUrl) {
                    urlStr = response.request.res.responseUrl;
                }
            } catch(e) {
                // Ignore timeout or network errors, proceed with original
            }
        }

        const url = new URL(urlStr);
        const segments = url.pathname.split('/').filter(Boolean);
        
        if (url.hostname.includes('amazon')) {
            const dpIndex = segments.indexOf('dp');
            if (dpIndex > 0) return segments[dpIndex - 1].replace(/-/g, ' ');
            if (dpIndex === 0 && segments.length > 1) return segments[1]; // Return ASIN
        }
        
        if (url.hostname.includes('flipkart')) {
            if (segments.length > 0 && segments[0].length > 5) {
                return segments[0].replace(/-/g, ' ');
            }
        }
        
        if (url.hostname.includes('myntra')) {
            if (segments.length >= 3) return segments[2].replace(/-/g, ' ');
        }
        
        // Generic fallback: Try to find a long slug with hyphens
        const slug = segments.find(s => s.includes('-') && s.length > 10);
        if (slug) return slug.replace(/-/g, ' ');
        
        return input; // Fallback if no recognizable pattern
    } catch (e) { return input; }
}

// --- SEARCH ROUTE ---
app.get('/api/search', async (req, res) => {
  try {
    let query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing query parameter 'q'" });

    query = await extractProductFromUrl(query);

    const cachedData = getFromCache(query.toLowerCase());
    if (cachedData) {
      console.log(`⚡ Serving from cache: ${query}`);
      return res.json(cachedData);
    }

    console.log(`🔎 Searching for: ${query}...`);

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
        history: generateHistory(currentPrice),
        description: item.snippet || "",
        specs: item.extensions || [],
        rating: item.rating || null,
        reviews: item.reviews || null
      };
    });

    const sorted = products.sort((a, b) => a.raw_price - b.raw_price);
    
    // Save to cache
    searchCache.set(query.toLowerCase(), {
      timestamp: Date.now(),
      data: sorted
    });

    res.json(sorted);
  } catch (error) {
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: "Search failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});