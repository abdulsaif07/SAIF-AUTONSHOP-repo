import React, { useState, Suspense, lazy } from 'react';
import { Moon, Sun, ShoppingBag, ShoppingCart, Menu, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentModal = lazy(() => import('./PaymentModal'));

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const handleNav = (path) => {
     navigate(path);
     setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-group-left">
        <div className="logo" onClick={() => handleNav('/')}>
          <ShoppingBag className="logo-icon" size={28} />
          <span className="logo-text">Autonshop</span>
        </div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      <div className={`nav-group-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-links">
          <span onClick={() => handleNav('/')}>Home</span>
          <span onClick={() => handleNav('/categories')}>Categories</span>
          <span onClick={() => handleNav('/wishlist')}>Wishlist</span>
          <span onClick={() => handleNav('/history')}>History</span>
        </div>
        
        <div className="auth-menu">
          <button className="theme-toggle" onClick={() => { setDarkMode(!darkMode); setMobileMenuOpen(false); }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && !user.isPremium && (
             <button onClick={() => { setShowPaymentModal(true); setMobileMenuOpen(false); }} style={{ background: 'linear-gradient(45deg, #FF6B00, #FFA800)', border: 'none', padding: '8px 16px', borderRadius: '20px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                <Star size={16} fill="white" /> Upgrade
             </button>
          )}

          {user && user.isPremium && (
             <button onClick={() => handleNav('/subscription')} className="shimmer-effect" style={{ background: 'var(--primary)', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#333333', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', position: 'relative', overflow: 'hidden' }}>
                <Star size={16} fill="#333333" /> Premium
             </button>
          )}

          {user ? (
            <button className="login-btn" onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</button>
          ) : (
            <button className="login-btn" onClick={() => handleNav('/login')}>Login / Register</button>
          )}
        </div>
      </div>
      
      {showPaymentModal && (
        <Suspense fallback={null}>
           <PaymentModal onClose={() => setShowPaymentModal(false)} onSuccess={() => setShowPaymentModal(false)} />
        </Suspense>
      )}
    </nav>
  );
};

export default Navbar;
