import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyAlerts = () => {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAlerts();
  }, [user, navigate]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/alerts/${id}`);
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete alert');
    }
  };

  const triggerTestEmail = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/alerts/test-email/${id}`);
      alert('Test email successfully dispatched! Check your inbox.');
    } catch (err) {
      alert('Failed to send test email. Ensure your Gmail credentials are correct in the .env file.');
    }
  };

  if (loading) return <div className="placeholder"><h2>Loading your alerts...</h2></div>;

  return (
    <div className="main-content fade-in">
      <div className="section-header">
        <h2>🔔 My Price Alerts</h2>
        <p>Track your target prices and simulate price drops</p>
      </div>

      {alerts.length === 0 ? (
        <div className="placeholder" style={{marginTop: '40px'}}>
          <p>You aren't tracking any products yet.</p>
          <button className="primary-btn" onClick={() => navigate('/')}>Find Deals</button>
        </div>
      ) : (
        <div className="alerts-grid">
          {alerts.map(alert => (
            <div key={alert._id} className="alert-card glass-panel">
              <div className="alert-header">
                <h3>{alert.productTitle.substring(0, 50)}...</h3>
                <span className="badge fair-price">Active</span>
              </div>
              
              <div className="alert-prices">
                <div className="price-box">
                  <span className="label">Current</span>
                  <span className="value">₹{alert.currentPrice}</span>
                </div>
                <div className="price-box target">
                  <span className="label">Target</span>
                  <span className="value">₹{alert.targetPrice}</span>
                </div>
              </div>

              <div className="alert-actions">
                <a href={alert.productLink} target="_blank" rel="noreferrer" className="action-btn link">
                  <ExternalLink size={16} /> View
                </a>
                <button className="action-btn email" onClick={() => triggerTestEmail(alert._id)}>
                  <Mail size={16} /> Test Email
                </button>
                <button className="action-btn delete" onClick={() => deleteAlert(alert._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAlerts;
