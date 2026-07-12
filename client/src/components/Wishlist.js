import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('autonshop_wishlist')) || [];
    setWishlist(saved);
  }, []);

  const clearWishlist = () => {
    localStorage.removeItem('autonshop_wishlist');
    setWishlist([]);
  };

  return (
    <div className="main-content fade-in" style={{ minHeight: '60vh' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h2><Heart size={28} fill="#EF4444" color="#EF4444" style={{ marginRight: '10px', verticalAlign: 'middle' }} /> My Wishlist</h2>
          <p>Saved deals you are watching</p>
        </div>
        {wishlist.length > 0 && (
          <button className="login-btn" onClick={clearWishlist} style={{ borderColor: '#EF4444', color: '#EF4444' }}>
            <Trash2 size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Clear
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="placeholder" style={{ marginTop: '40px' }}>
          <p>You haven't saved any deals yet.</p>
          <button className="primary-btn" onClick={() => navigate('/')}>Find Deals</button>
        </div>
      ) : (
        <div className="trending-grid">
          {wishlist.map((item, index) => (
            <div key={index} className="trend-card" onClick={() => navigate('/results')} style={{position: 'relative'}}>
              <img src={item.image} alt={item.title} className="trend-img" style={{maxHeight: '150px', objectFit: 'contain'}} />
              <h3>{item.title.substring(0, 40)}...</h3>
              <div className="price-row">
                <span className="price">{item.price}</span>
                <span className="store-badge">{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
