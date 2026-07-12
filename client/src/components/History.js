import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('autonshop_history')) || [];
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('autonshop_history');
    setHistory([]);
  };

  return (
    <div className="main-content fade-in" style={{ minHeight: '60vh' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h2><HistoryIcon size={28} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Recently Viewed</h2>
          <p>Products you checked out recently</p>
        </div>
        {history.length > 0 && (
          <button className="login-btn" onClick={clearHistory} style={{ borderColor: '#EF4444', color: '#EF4444' }}>
            <Trash2 size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="placeholder" style={{ marginTop: '40px' }}>
          <p>You haven't viewed any products yet.</p>
          <button className="primary-btn" onClick={() => navigate('/')}>Find Deals</button>
        </div>
      ) : (
        <div className="trending-grid">
          {history.map((item, index) => (
            <div key={index} className="trend-card" onClick={() => navigate('/results')}>
              <img src={item.image} alt={item.title} className="trend-img" />
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

export default History;
