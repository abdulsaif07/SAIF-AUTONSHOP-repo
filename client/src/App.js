// client/src/App.js
import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import DealBanner from './components/DealBanner';
import TrendingGrid from './components/TrendingGrid';
import FeaturesSection from './components/FeaturesSection';
import SkeletonLoader from './components/SkeletonLoader';
import { useToast } from './components/Toast';

import './App.css';

const History = lazy(() => import('./components/History'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const CompareModal = lazy(() => import('./components/CompareModal'));
const Login = lazy(() => import('./components/Auth/Login'));
const Signup = lazy(() => import('./components/Auth/Signup'));
const CategoryGrid = lazy(() => import('./components/CategoryGrid'));

const ALL_TRENDING_PRODUCTS = [
  { title: "iPhone 15 Pro", image: "https://m.media-amazon.com/images/I/81SigpJN1KL._AC_SL1500_.jpg", price: "₹1,34,900", tag: "Hot Tech", query: "iPhone 15 Pro" },
  { title: "PlayStation 5", image: "https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg", price: "₹44,990", tag: "Gamer's Pick", query: "PlayStation 5 Console" },
  { title: "Samsung S24 Ultra", image: "https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SL1500_.jpg", price: "₹1,29,999", tag: "Android King", query: "Samsung Galaxy S24 Ultra" },
  { title: "MacBook Air M2", image: "https://m.media-amazon.com/images/I/719C6bJv8jL._AC_SL1500_.jpg", price: "₹99,900", tag: "Student Fav", query: "Apple MacBook Air M2" },
  { title: "Sony WH-1000XM5", image: "https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_SL1000_.jpg", price: "₹26,990", tag: "Best Audio", query: "Sony WH-1000XM5 Headphones" },
  { title: "Apple Watch S9", image: "https://m.media-amazon.com/images/I/71XMTLtZd5L._AC_SL1500_.jpg", price: "₹41,900", tag: "Wearable", query: "Apple Watch Series 9" }
];



const getStoreStyle = (sourceName) => {
  const name = sourceName ? sourceName.toLowerCase() : "";
  if (name.includes('amazon')) return { bg: '#232f3e', label: 'Amz' };
  if (name.includes('flipkart')) return { bg: '#2874f0', label: 'Flip' };
  if (name.includes('croma')) return { bg: '#00b5b5', label: 'Croma' };
  if (name.includes('ajio')) return { bg: '#2c4152', label: 'Ajio' };
  if (name.includes('reliance')) return { bg: '#e42529', label: 'Rel' };
  if (name.includes('tata')) return { bg: '#5f259f', label: 'Tata' };
  return { bg: '#666', label: 'Store' }; 
};

function MainApp() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [model, setModel] = useState(null);
  const [dailyDeals, setDailyDeals] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('autonshop_darkmode') === 'true';
  });
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const [compareItems, setCompareItems] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const { addToast, ToastContainer } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    async function initApp() {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      const shuffled = [...ALL_TRENDING_PRODUCTS].sort(() => 0.5 - Math.random());
      setDailyDeals(shuffled.slice(0, 6)); 
    }
    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('autonshop_darkmode', darkMode);
  }, [darkMode]);

  const searchProducts = async (searchTerm = query) => {
    if(!searchTerm) return;
    setLoading(true);
    setProducts([]);
    setSelectedProduct(null);
    setQuery(searchTerm);
    setSortOrder("");
    setMinPrice("");
    setMaxPrice("");
    setStoreFilter("");
    navigate('/results');

    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      addToast("Error fetching data. Check your backend and API keys.");
    }
    setLoading(false);
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
                let bestGuess = predictions[0].className.split(',')[0];
                if (bestGuess.includes("iPod") || bestGuess.includes("cellular")) bestGuess = "Smartphone";
                if (bestGuess.includes("running shoe")) bestGuess = "Nike Running Shoes";
                setQuery(bestGuess);
                setAnalyzing(false);
                searchProducts(bestGuess);
            } else { setAnalyzing(false); }
        };
    }
  };

  const handleProductSelect = (item) => {
    setSelectedProduct(item);
    // Save to local storage for History feature
    const saved = JSON.parse(localStorage.getItem('autonshop_history')) || [];
    const filtered = saved.filter(p => p.title !== item.title);
    filtered.unshift(item);
    if(filtered.length > 12) filtered.pop();
    localStorage.setItem('autonshop_history', JSON.stringify(filtered));
  };

  const getAlternativeProduct = () => {
    if (!selectedProduct || products.length < 2) return null;
    const alt = products.find(p => p.source !== selectedProduct.source);
    return alt || {
        source: "Local Retail",
        raw_price: selectedProduct.raw_price * 1.15,
        price: "₹" + (selectedProduct.raw_price * 1.15).toFixed(0),
        link: "#"
    };
  };

  const handleCompareToggle = (item) => {
    setCompareItems(prev => {
      const exists = prev.find(p => p.title === item.title);
      if (exists) return prev.filter(p => p.title !== item.title);
      if (prev.length >= 2) return [prev[1], item];
      return [...prev, item];
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (minPrice && p.raw_price < parseInt(minPrice)) return false;
      if (maxPrice && p.raw_price > parseInt(maxPrice)) return false;
      if (storeFilter && !p.source.toLowerCase().includes(storeFilter.toLowerCase())) return false;
      return true;
    });
  }, [products, minPrice, maxPrice, storeFilter]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOrder === "low") return a.raw_price - b.raw_price;
      if (sortOrder === "high") return b.raw_price - a.raw_price;
      return 0; // Relevance / Default
    });
  }, [filteredProducts, sortOrder]);

  const featuredDeal = dailyDeals.length > 0 ? dailyDeals[0] : null;

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <Suspense fallback={<div className="main-content"><SkeletonLoader count={3} /></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/history" element={<History />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          <Route path="/" element={
            <>
              <SearchBar query={query} setQuery={setQuery} onSearch={searchProducts} analyzing={analyzing} handleImageUpload={handleImageUpload} loading={loading} />
              <div className="main-content fade-in">
                {loading ? <SkeletonLoader count={6} /> : (
                  <>
                    <DealBanner featuredDeal={featuredDeal} searchProducts={searchProducts} />
                    <TrendingGrid dailyDeals={dailyDeals} searchProducts={searchProducts} />
                    <FeaturesSection />
                  </>
                )}
              </div>
            </>
          } />

          <Route path="/categories" element={<CategoryGrid searchProducts={searchProducts} />} />

          <Route path="/results" element={
          <>
            <SearchBar query={query} setQuery={setQuery} onSearch={searchProducts} analyzing={analyzing} handleImageUpload={handleImageUpload} loading={loading} />
            <div className="main-content fade-in" style={{flexDirection: 'row', gap: '20px', alignItems: 'flex-start'}}>
                <div className="product-list">
                  
                  {products.length > 0 && (
                    <div className="results-header" style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                         <span style={{fontWeight: 600, color: 'var(--gray)'}}>{filteredProducts.length} Results</span>
                         <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="sort-dropdown">
                           <option value="">Sort by Relevance</option>
                           <option value="low">Price: Low to High</option>
                           <option value="high">Price: High to Low</option>
                         </select>
                      </div>
                      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                         <input type="number" placeholder="Min Price (₹)" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="sort-dropdown" style={{width: '120px'}} />
                         <input type="number" placeholder="Max Price (₹)" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="sort-dropdown" style={{width: '120px'}} />
                         <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)} className="sort-dropdown">
                            <option value="">All Stores</option>
                            <option value="amazon">Amazon</option>
                            <option value="flipkart">Flipkart</option>
                            <option value="croma">Croma</option>
                            <option value="reliance">Reliance Digital</option>
                         </select>
                      </div>
                    </div>
                  )}

                  {products.length === 0 && !loading && <div className="placeholder"><h2>No results found</h2></div>}
                  
                  {loading ? <SkeletonLoader count={8} /> : (
                    sortedProducts.map((item, index) => (
                        <ProductCard 
                           key={item.title + index} 
                           item={item} 
                           isSelected={selectedProduct === item} 
                           onClick={() => handleProductSelect(item)} 
                           onCompareToggle={handleCompareToggle}
                           isCompared={compareItems.some(p => p.title === item.title)}
                        />
                    ))
                  )}
                </div>
                {selectedProduct && (
                  <ProductDetail selectedProduct={selectedProduct} getAlternativeProduct={getAlternativeProduct} getStoreStyle={getStoreStyle} />
                )}
            </div>
          </>
        } />
      </Routes>
      </Suspense>

      {compareItems.length > 0 && (
         <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, boxShadow: '0 -4px 15px rgba(0,0,0,0.1)' }}>
            <div>
               <h4 style={{ margin: '0 0 5px 0' }}>Compare Products ({compareItems.length}/2)</h4>
               <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray)' }}>{compareItems.map(i => i.title.substring(0,25) + '...').join(' vs ')}</p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
               <button onClick={() => setCompareItems([])} style={{ background: 'transparent', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontWeight: 600 }}>Clear</button>
               <button 
                 onClick={() => setShowCompareModal(true)} 
                 disabled={compareItems.length < 2}
                 style={{ background: compareItems.length === 2 ? 'var(--primary)' : 'var(--border-color)', color: compareItems.length === 2 ? 'white' : 'var(--gray)', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: compareItems.length === 2 ? 'pointer' : 'not-allowed' }}
               >
                 Compare Now
               </button>
            </div>
         </div>
      )}

      {showCompareModal && (
        <Suspense fallback={<div>Loading Modal...</div>}>
          <CompareModal items={compareItems} onClose={() => setShowCompareModal(false)} />
        </Suspense>
      )}

      <ScrollToTop />
      <Footer />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </Router>
  );
}

export default App;