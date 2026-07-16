import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AlertModal = ({ product, onClose, addToast }) => {
  const [targetPrice, setTargetPrice] = useState(product.raw_price * 0.9); // Default 10% drop
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast("Please log in to set price alerts.");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('autonshop_token');
      await axios.post('http://localhost:5000/api/alerts', {
        productTitle: product.title,
        productLink: product.link,
        targetPrice: targetPrice,
        currentPrice: product.raw_price
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      addToast("Price alert set successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.msg || "Failed to set alert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content pop-in">
        <button className="close-btn" onClick={onClose}><X size={24}/></button>
        <Bell size={40} color="var(--primary)" style={{marginBottom: '15px'}}/>
        <h2>Set Price Alert</h2>
        <p className="modal-subtitle">We'll remind you when the price drops below your target.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product</label>
            <input type="text" value={product.title} disabled style={{background: 'var(--bg)', color: 'var(--gray)'}} />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Current Price</label>
              <input type="text" value={product.price} disabled style={{background: 'var(--bg)', color: 'var(--gray)'}} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Target Price (₹)</label>
              <input 
                type="number" 
                value={targetPrice} 
                onChange={(e) => setTargetPrice(e.target.value)} 
                required 
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notification Email</label>
            <input type="email" value={user?.email || ''} disabled style={{background: 'var(--bg)', color: 'var(--gray)'}} />
            <small style={{ color: 'var(--gray)', fontSize: '12px' }}>Alerts will be sent directly to your registered email address.</small>
          </div>

          <button type="submit" className="primary-btn" style={{width: '100%', marginTop: '10px'}} disabled={loading}>
            {loading ? 'Setting...' : 'Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlertModal;
