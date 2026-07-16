import React, { useState, Suspense, lazy } from 'react';
import { Share2, ShoppingBag } from 'lucide-react';
import { useToast } from './Toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const PaymentModal = lazy(() => import('./PaymentModal'));

const ProductDetail = ({ selectedProduct, getAlternativeProduct, getStoreStyle }) => {
  const [copied, setCopied] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState('idle');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { addToast, ToastContainer } = useToast();
  const { user } = useAuth();
  const altProduct = getAlternativeProduct();

  if (!selectedProduct) return null;

  const handleShare = () => {
    const url = window.location.origin + '/results?q=' + encodeURIComponent(selectedProduct.title);
    navigator.clipboard.writeText(url);
    addToast('Link copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExternalLink = () => {
     const source = selectedProduct.source.toLowerCase();
     const q = encodeURIComponent(selectedProduct.title);
     if (source.includes('amazon')) return `https://www.amazon.in/s?k=${q}`;
     if (source.includes('flipkart')) return `https://www.flipkart.com/search?q=${q}`;
     if (source.includes('croma')) return `https://www.croma.com/searchB?q=${q}`;
     return `https://www.google.com/search?tbm=shop&q=${q}`;
  };

  const handleNotifyClick = () => {
    const savedAlerts = JSON.parse(localStorage.getItem('autonshop_alerts')) || [];
    if (!savedAlerts.find(a => a.title === selectedProduct.title)) {
      savedAlerts.push({
        title: selectedProduct.title,
        image: selectedProduct.image,
        currentPrice: selectedProduct.price,
        source: selectedProduct.source,
        dateAdded: new Date().toLocaleDateString()
      });
      localStorage.setItem('autonshop_alerts', JSON.stringify(savedAlerts));
    }
    setNotifyStatus('done');
    addToast('Chill karo! You will be notified of price drops.');
    setTimeout(() => setNotifyStatus('idle'), 3000);
  };

  return (
    <div className="detail-view">
      <div className="detail-header">
        <h2>{selectedProduct.title}</h2>
        {selectedProduct.rating && (
          <div className="rating-badge" style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px', color: '#F59E0B', fontWeight: 600}}>
            ⭐ {selectedProduct.rating} <span style={{color: 'var(--gray)', fontSize: '13px'}}>({selectedProduct.reviews} reviews)</span>
          </div>
        )}
        <div className="main-price-block">
          <h1>{selectedProduct.price}</h1>
          <span className="badge fair-price-large">{selectedProduct.deal_rating}</span>
        </div>
        <div style={{display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap'}}>
          <a href={getExternalLink()} target="_blank" rel="noreferrer" className="action-btn email" style={{textDecoration: 'none', flex: 1, minWidth: '150px', display: 'flex', justifyContent: 'center'}}>
            Buy on {selectedProduct.source} <ShoppingBag size={16} style={{marginLeft: '6px'}} />
          </a>
          <button className="action-btn" onClick={handleShare} style={{background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text)', flex: 0.5, minWidth: '100px'}}>
            <Share2 size={16} style={{marginRight: '6px'}}/> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
      
      {(selectedProduct.description || (selectedProduct.specs && selectedProduct.specs.length > 0)) && (
        <div className="product-info-section" style={{marginTop: '30px', padding: '25px', background: 'var(--input-bg)', borderRadius: '20px', border: '1px solid var(--border-color)'}}>
          <h3 style={{marginTop: 0, fontSize: '18px'}}>About this item</h3>
          {selectedProduct.description && (
            <p style={{color: 'var(--gray)', lineHeight: 1.6, fontSize: '14px', marginBottom: '20px'}}>{selectedProduct.description}</p>
          )}
          {selectedProduct.specs && selectedProduct.specs.length > 0 && (
            <div className="specs-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              {selectedProduct.specs.map((spec, i) => (
                <div key={i} style={{background: 'var(--card-bg)', padding: '10px 15px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text)', border: '1px solid var(--border-color)'}}>
                  {spec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="chart-container">
        <h3>30-Day Price History</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={selectedProduct.history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#333333" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#333333" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#333333" strokeWidth={3} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="comparison-section">
        <h3>Live Price Comparison</h3>
        
        {/* BEST OPTION */}
        <div className="compare-card best-option">
          <div className="store-info">
            <div className="store-logo" style={{backgroundColor: getStoreStyle(selectedProduct.source).bg}}>
              {getStoreStyle(selectedProduct.source).label}
            </div>
            <div>
              <span className="store-name">{selectedProduct.source || "Best Store"}</span>
              <div className="lowest-label">Lowest Price</div>
            </div>
          </div>
          <div className="price-action">
            <span className="price-bold">{selectedProduct.price}</span>
            <a href={selectedProduct.link} target="_blank" rel="noreferrer" className="buy-btn-small">
              Buy <ShoppingBag size={14}/>
            </a>
          </div>
        </div>

        {/* ALTERNATIVE OPTION */}
        {altProduct && (
          <div className="compare-card">
            <div className="store-info">
              <div className="store-logo" style={{backgroundColor: getStoreStyle(altProduct.source).bg}}>
                {getStoreStyle(altProduct.source).label}
              </div>
              <div>
                <span className="store-name">{altProduct.source || "Alternative"}</span>
                <div className="diff-label">Check Price</div>
              </div>
            </div>
            <div className="price-action">
              <span className="price-bold">{altProduct.price}</span>
              {altProduct.link !== "#" ? (
                <a href={altProduct.link} target="_blank" rel="noreferrer" className="view-btn-small">View</a>
              ) : (
                <button className="view-btn-small">View</button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="price-alert-box" style={{marginTop: '30px', padding: '20px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <h3 style={{margin: 0, fontSize: '16px', color: 'var(--text)'}}>🔔 Get Price Drop Alerts</h3>
        <p style={{margin: 0, fontSize: '13px', color: 'var(--gray)'}}>Enter your email to get notified when this product hits its lowest price.</p>
        <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
          <input type="email" placeholder="Your Email Address" defaultValue={user ? user.email : ''} style={{flex: 1, padding: '10px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text)', outline: 'none', fontFamily: 'Outfit'}} />
          <button 
            className="primary-btn" 
            onClick={handleNotifyClick} 
            style={{padding: '10px 20px', margin: 0, borderRadius: '10px', fontSize: '14px', background: notifyStatus === 'done' ? '#10B981' : 'var(--primary)', color: notifyStatus === 'done' ? 'white' : '#333333'}}
          >
            {notifyStatus === 'done' ? 'Chill karo! ✌️' : 'Notify Me'}
          </button>
        </div>
      </div>

      <ToastContainer />
      {showPaymentModal && (
        <Suspense fallback={null}>
          <PaymentModal 
            onClose={() => setShowPaymentModal(false)} 
            onSuccess={() => setShowPaymentModal(false)} 
          />
        </Suspense>
      )}
    </div>
  );
};

export default ProductDetail;
