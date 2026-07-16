import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Calendar, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';

const SubscriptionDashboard = () => {
  const { user, unsubscribeUser } = useAuth();
  const navigate = useNavigate();
  const { addToast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('autonshop_alerts')) || [];
    setAlerts(saved);
  }, []);

  const cancelAlert = (title) => {
    const filtered = alerts.filter(a => a.title !== title);
    setAlerts(filtered);
    localStorage.setItem('autonshop_alerts', JSON.stringify(filtered));
    addToast("Notification cancelled.");
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel your Premium Subscription? You will lose access to price alerts.")) {
      setLoading(true);
      try {
        await unsubscribeUser();
        addToast("Subscription cancelled successfully.");
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        addToast("Failed to cancel subscription.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>My Subscription</h1>
      
      {user.isPremium ? (
        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '30px', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.15)' }}>
          <div className="shimmer-effect" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '5px 15px', borderBottomLeftRadius: '15px', fontWeight: 'bold', overflow: 'hidden' }}>
            ACTIVE
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(45deg, #FF6B00, #FFA800)', padding: '15px', borderRadius: '50%', color: 'white' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 5px 0' }}>Autonshop Premium</h2>
              <p style={{ color: 'var(--gray)', margin: 0 }}>₹99 / month</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', marginBottom: '5px' }}>
                <Calendar size={16} /> Next Billing
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>August 14, 2026</div>
            </div>
            <div style={{ background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', marginBottom: '5px' }}>
                <CreditCard size={16} /> Payment Method
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>UPI (AutoPay)</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Included Features</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="var(--primary)" /> Unlimited Price Drop Alerts</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="var(--primary)" /> Restock Notifications</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="var(--primary)" /> Ad-free Experience</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px', marginTop: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Your Active Price Alerts</h3>
            {alerts.length === 0 ? (
              <p style={{color: 'var(--gray)'}}>You don't have any active price drop alerts.</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {alerts.map((item, idx) => (
                  <div key={idx} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                      <img src={item.image} alt={item.title} style={{width: '50px', height: '50px', objectFit: 'contain', background: 'white', borderRadius: '8px'}} />
                      <div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text)'}}>{item.title.substring(0, 30)}...</h4>
                        <div style={{fontSize: '13px', color: 'var(--gray)'}}>Tracking drops below {item.currentPrice} on {item.source}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => cancelAlert(item.title)}
                      style={{background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', padding: '8px 12px', fontSize: '13px', fontWeight: 600}}
                    >
                      Cancel Notification
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleCancel} 
              disabled={loading}
              style={{ background: 'transparent', color: '#EF4444', border: '1px solid #EF4444', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <AlertCircle size={16} /> {loading ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <ShieldCheck size={60} color="var(--gray)" style={{ marginBottom: '20px' }} />
          <h2>No Active Subscription</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>You are currently on the standard free plan. Upgrade to Premium to unlock Price Alerts.</p>
          <button 
            onClick={() => navigate('/')} 
            className="primary-btn" 
            style={{ padding: '12px 25px', fontSize: '16px' }}>
            Explore Deals & Upgrade
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SubscriptionDashboard;
