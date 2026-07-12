import React, { useState } from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProductDetail = ({ selectedProduct, getAlternativeProduct, getStoreStyle }) => {
  const [copied, setCopied] = useState(false);
  const altProduct = getAlternativeProduct();

  if (!selectedProduct) return null;

  const handleShare = () => {
    const url = window.location.origin + '/results?q=' + encodeURIComponent(selectedProduct.title);
    navigator.clipboard.writeText(url);
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

  return (
    <div className="detail-view">
      <div className="detail-header">
        <h2>{selectedProduct.title}</h2>
        <div className="main-price-block">
          <h1>{selectedProduct.price}</h1>
          <span className="badge fair-price-large">{selectedProduct.deal_rating}</span>
        </div>
        <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
          <a href={getExternalLink()} target="_blank" rel="noreferrer" className="action-btn email" style={{textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center'}}>
            Buy on {selectedProduct.source} <ExternalLink size={16} />
          </a>
          <button className="action-btn" onClick={handleShare} style={{background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text)', flex: 0.5}}>
            <Share2 size={16} style={{marginRight: '6px'}}/> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        <h3>30-Day Price History</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={selectedProduct.history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} fill="url(#colorPrice)" />
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
              Buy <ExternalLink size={12}/>
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
    </div>
  );
};

export default ProductDetail;
