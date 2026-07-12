import React, { useState, useEffect, useMemo } from 'react';
import { Heart } from 'lucide-react';

const ProductCard = ({ item, isSelected, onClick, onCompareToggle, isCompared }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  
  const rating = useMemo(() => (Math.random() * (5 - 3.5) + 3.5).toFixed(1), []);
  const reviews = useMemo(() => Math.floor(Math.random() * 5000) + 100, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('autonshop_wishlist')) || [];
    setIsWishlist(saved.some(p => p.title === item.title));
  }, [item.title]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('autonshop_wishlist')) || [];
    let updated;
    if(isWishlist) {
      updated = saved.filter(p => p.title !== item.title);
    } else {
      updated = [item, ...saved];
    }
    localStorage.setItem('autonshop_wishlist', JSON.stringify(updated));
    setIsWishlist(!isWishlist);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(item);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/400x400/png?text=Product+Image";
  };

  return (
    <div className={`product-card ${isSelected ? 'active' : ''}`} onClick={onClick} style={{ position: 'relative' }}>
      
      <button 
        onClick={toggleWishlist} 
        style={{
          position: 'absolute', top: '12px', right: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '6px', cursor: 'pointer', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
        }}
      >
        <Heart size={18} fill={isWishlist ? '#EF4444' : 'transparent'} color={isWishlist ? '#EF4444' : 'var(--gray)'} />
      </button>

      {onCompareToggle && (
         <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
           <input 
             type="checkbox" 
             checked={isCompared || false}
             onChange={handleCompareClick}
             onClick={(e) => e.stopPropagation()}
             style={{ width: '18px', height: '18px', cursor: 'pointer' }}
             title="Compare Product"
           />
         </div>
      )}

      <div className="card-image" style={{ textAlign: 'center', padding: '20px' }}>
        <img src={item.image} alt={item.title} onError={handleImageError} style={{ maxHeight: '150px', objectFit: 'contain' }} />
      </div>
      <div className="info" style={{ padding: '15px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 5px 0' }}>{item.title}</h3>
        <p className="desc-text" style={{ fontSize: '12px', color: 'var(--gray)', margin: '0 0 5px 0' }}>{item.source}</p>
        <div className="product-rating" style={{color: '#f59e0b', fontSize: '12px', margin: '0 0 10px 0'}}>
            ★ {rating} <span style={{color: 'var(--gray)'}}>({reviews})</span>
        </div>
        <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="price" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{item.price}</span>
          <span className="badge fair-price" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{item.deal_rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
