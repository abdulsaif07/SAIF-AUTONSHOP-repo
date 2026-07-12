import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AlertModal = ({ product, onClose }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Set default target price 10% lower than current price
  const suggestedPrice = Math.floor(product.raw_price * 0.9);
  const [targetPrice, setTargetPrice] = useState(suggestedPrice);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/alerts', {
        productTitle: product.title,
        productLink: product.link,
        targetPrice: Number(targetPrice),
        currentPrice: product.raw_price
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      alert('Failed to set alert. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {success ? (
          <div className="success-message">
            <h3>🎉 Alert Set Successfully!</h3>
            <p>We'll email you when the price drops below ₹{targetPrice}.</p>
            <button className="primary-btn" style={{marginTop: '20px'}} onClick={() => { onClose(); navigate('/alerts'); }}>
              View My Alerts
            </button>
          </div>
        ) : (
          <>
            <h2>Set Price Alert</h2>
            <p className="modal-subtitle">{product.title}</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Price: ₹{product.raw_price}</label>
                <input 
                  type="number" 
                  value={targetPrice} 
                  onChange={(e) => setTargetPrice(e.target.value)} 
                  placeholder="Enter target price"
                  required 
                />
                <small>We suggest 10% off: ₹{suggestedPrice}</small>
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Setting Alert...' : 'Notify Me'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
