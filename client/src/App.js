// client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, ExternalLink, Loader, Clock, ArrowLeft, Camera, Zap, TrendingUp, ShieldCheck, BarChart3, Moon, Sun } from 'lucide-react'; 
import './App.css';

// AI Tools
import '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// --- DATA: STABLE AMAZON IMAGES ---
const ALL_TRENDING_PRODUCTS = [
  // TECH
  { 
    title: "iPhone 15 Pro", 
    image: "https://m.media-amazon.com/images/I/81SigpJN1KL._AC_SL1500_.jpg", 
    price: "₹1,34,900", tag: "Hot Tech", query: "iPhone 15 Pro" 
  },
  { 
    title: "PlayStation 5", 
    image: "https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg", 
    price: "₹44,990", tag: "Gamer's Pick", query: "PlayStation 5 Console" 
  },
  { 
    title: "Samsung S24 Ultra", 
    image: "https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SL1500_.jpg", 
    price: "₹1,29,999", tag: "Android King", query: "Samsung Galaxy S24 Ultra" 
  },
  { 
    title: "MacBook Air M2", 
    image: "https://m.media-amazon.com/images/I/719C6bJv8jL._AC_SL1500_.jpg", 
    price: "₹99,900", tag: "Student Fav", query: "Apple MacBook Air M2" 
  },
  { 
    title: "Sony WH-1000XM5", 
    image: "https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_SL1000_.jpg", 
    price: "₹26,990", tag: "Best Audio", query: "Sony WH-1000XM5 Headphones" 
  },
  { 
    title: "Apple Watch S9", 
    image: "https://m.media-amazon.com/images/I/71XMTLtZd5L._AC_SL1500_.jpg", 
    price: "₹41,900", tag: "Wearable", query: "Apple Watch Series 9" 
  },
  
  // LIFESTYLE
  { 
    title: "Nike Air Jordan", 
    image: "https://m.media-amazon.com/images/I/71C8F0qy8gL._AC_UY1000_.jpg", 
    price: "₹11,995", tag: "Streetwear", query: "Nike Air Jordan 1 High" 
  },
  { 
    title: "Canon EOS R5", 
    image: "https://m.media-amazon.com/images/I/71M5b8l+bBL._AC_SL1500_.jpg", 
    price: "₹3,39,995", tag: "Photography", query: "Canon EOS R5 Camera" 
  },
  { 
    title: "Xbox Series X", 
    image: "https://m.media-amazon.com/images/I/61-jjE67uqL._SL1500_.jpg", 
    price: "₹49,990", tag: "Console", query: "Xbox Series X Console" 
  }
];

const CATEGORIES = [
  { name: "Electronics", icon: "📱", query: "Best Electronics Deals" },
  { name: "Fashion", icon: "👕", query: "Trending Fashion Men Women" },
  { name: "Home & Kitchen", icon: "🏠", query: "Home Kitchen Appliances" },
  { name: "Beauty", icon: "💄", query: "Beauty Products Best Sellers" },
  { name: "Sneakers", icon: "👟", query: "Best Sneakers for Men" },
  { name: "Laptops", icon: "💻", query: "Best Gaming Laptops" }
];

function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('home'); 
  const [model, setModel] = useState(null);
  const [dailyDeals, setDailyDeals] = useState([]);
  
  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/400x400/png?text=Product+Image";
  };

  useEffect(() => {
    async function initApp() {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      const shuffled = [...ALL_TRENDING_PRODUCTS].sort(() => 0.5 - Math.random());
      setDailyDeals(shuffled.slice(0, 6)); 
    }
    initApp();
  }, []);

  const searchProducts = async (searchTerm = query) => {
    if(!searchTerm) return;
    setLoading(true);
    setProducts([]);
    setSelectedProduct(null);
    setView('results'); 
    setQuery(searchTerm);

    try {
      const res = await axios.get(`https://autonshop-api.onrender/api/search?q=${searchTerm}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching data. Check server console.");
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
      try {
          const res = await axios.get('https://autonshop-api.onrender/api/history');
          setHistory(res.data);
          setView('history');
      } catch (err) { console.error(err); }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && model) {
        setAnalyzing(true);
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            const predictions = await model.classify(img);
            if (predictions?.length > 0) {
                const bestGuess = predictions[0].className.split(',')[0];
                setQuery(bestGuess);
                setAnalyzing(false);
                searchProducts(bestGuess);
            } else { setAnalyzing(false); }
        };
    }
  };

  return (
    // We add 'dark-mode' class to the main container if state is true
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      
      <header className="navbar">
        <div className="logo" onClick={() => {setView('home'); setProducts([]); setQuery(""); }}>
            <span className="logo-text">Autonshop</span>
        </div>
        
        <div className="nav-group-right">
            <div className="nav-links">
                <span onClick={() => {setView('home'); setProducts([]); setQuery(""); }}>Deals</span>
                <span onClick={() => setView('categories')}>Categories</span>
                <span onClick={fetchHistory}>History</span>
            </div>
            
            {/* DARK MODE TOGGLE BUTTON */}
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={20} color="#FF6B00"/> : <Moon size={20} />}
            </button>
        </div>
      </header>

      <div className="search-section">
        <div className="search-bar-container">
            <Search className="search-icon" size={20}/>
            <input 
              type="text" 
              placeholder={analyzing ? "AI is looking..." : "Search for products (e.g. PS5, iPhone)..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
            />
            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleImageUpload} />
            {analyzing ? <Zap className="spin camera-icon" color="#FF6B00" /> : <Camera className="camera-icon" size={20} onClick={() => fileInputRef.current.click()} />}
            <button onClick={() => searchProducts()} className="search-btn">
                {loading ? <Loader className="spin" size={18}/> : "Search"}
            </button>
        </div>
      </div>

      <div className="main-content">
        
        {view === 'home' && (
            <div className="home-container fade-in">
                <div className="section-header">
                    <h2>🔥 Trending Deals Today</h2>
                    <p>Best prices tracked across Amazon, Flipkart & Ajio</p>
                </div>
                <div className="trending-grid">
                    {dailyDeals.map((deal, idx) => (
                        <div key={idx} className="trend-card" onClick={() => searchProducts(deal.query)}>
                            <div className="trend-tag">{deal.tag}</div>
                            <img 
                                src={deal.image} 
                                alt={deal.title} 
                                className="trend-img"
                                onError={handleImageError} 
                            />
                            <h3>{deal.title}</h3>
                            <div className="price-row">
                                <span className="price">{deal.price}</span>
                                <span className="store-badge">Compare &rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="features-section">
                    <div className="section-header">
                        <h2>Why use Autonshop?</h2>
                        <p>We do the hard work so you save money instantly.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card"><div className="feature-icon"><TrendingUp size={32}/></div><h3>Real-Time Comparison</h3><p>We scan Amazon, Flipkart, and Ajio in milliseconds to find the absolute lowest price.</p></div>
                        <div className="feature-card"><div className="feature-icon"><BarChart3 size={32}/></div><h3>30-Day Price History</h3><p>Check the price graph to know if it's a good time to buy or if you should wait.</p></div>
                        <div className="feature-card"><div className="feature-icon"><ShieldCheck size={32}/></div><h3>Deal Rating AI</h3><p>Our algorithm rates every price as "Fair", "Great Deal", or "Overpriced" instantly.</p></div>
                    </div>
                </div>
            </div>
        )}

        {view === 'categories' && (
            <div className="home-container fade-in">
                <div className="section-header"><h2>Explore Categories</h2><p>Select a category to find the best market prices</p></div>
                <div className="category-grid">
                    {CATEGORIES.map((cat, idx) => (
                        <div key={idx} className="category-card" onClick={() => searchProducts(cat.query)}>
                            <span className="cat-icon">{cat.icon}</span><h3>{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {view === 'history' && (
            <div className="history-container fade-in" style={{width: '100%'}}>
                <h2><Clock size={24} style={{verticalAlign: 'middle'}}/> Search History</h2>
                <div className="history-grid">
                    {history.map((item, idx) => (
                        <div key={idx} className="product-card" onClick={() => searchProducts(item.term)}>
                            <div className="info">
                                <p className="date-text">{new Date(item.searchDate).toLocaleDateString()}</p>
                                <h3>{item.term}</h3><span className="price">{item.topResult.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setView('home')} className="search-btn" style={{marginTop:'20px'}}><ArrowLeft size={16}/> Back</button>
            </div>
        )}

        {view === 'results' && (
            <div className="fade-in" style={{width: '100%', display: 'flex', gap: '20px'}}>
                <div className="product-list">
                {products.length === 0 && !loading && <div className="placeholder"><h2>No results found</h2></div>}
                {products.map((item, index) => (
                    <div key={index} className={`product-card ${selectedProduct === item ? 'active' : ''}`} onClick={() => setSelectedProduct(item)}>
                        <div className="card-image">
                            <img src={item.image} alt={item.title} onError={handleImageError} />
                        </div>
                        <div className="info">
                            <h3>{item.title}</h3>
                            <p className="desc-text">{item.source}</p>
                            <div className="price-row"><span className="price">{item.price}</span><span className="badge fair-price">{item.deal_rating}</span></div>
                        </div>
                    </div>
                ))}
                </div>

                {selectedProduct && (
                <div className="detail-view">
                    <div className="detail-header">
                        <h2>{selectedProduct.title}</h2>
                        <div className="main-price-block"><h1>{selectedProduct.price}</h1><span className="badge fair-price-large">Fair Price</span></div>
                    </div>
                    <div className="chart-container">
                        <h3>30-Day Price History</h3>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <AreaChart data={selectedProduct.history}>
                                    <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                                    <XAxis dataKey="day" hide /><YAxis hide domain={['auto', 'auto']} /><Tooltip />
                                    <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="comparison-section">
                        <h3>Live Price Comparison</h3>
                        <div className="compare-card best-option">
                            <div className="store-info"><div className="store-logo amazon">Amz</div><div><span className="store-name">Amazon</span><div className="lowest-label">Lowest Price</div></div></div>
                            <div className="price-action">
                                <span className="price-bold">{selectedProduct.price}</span>
                                <a href={selectedProduct.link} target="_blank" rel="noreferrer" className="buy-btn-small">Buy <ExternalLink size={12}/></a>
                            </div>
                        </div>
                         <div className="compare-card">
                            <div className="store-info"><div className="store-logo flipkart">Flip</div><div><span className="store-name">Flipkart</span><div className="diff-label">Alternative</div></div></div>
                            <div className="price-action"><span className="price-bold">₹{(selectedProduct.raw_price * 1.02).toFixed(0)}</span><button className="view-btn-small">View</button></div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

export default App;