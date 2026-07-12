import React, { useState } from 'react';
import { Moon, Sun, ShoppingBag, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <span onClick={() => handleNav('/')}>Deals</span>
          <span onClick={() => handleNav('/categories')}>Categories</span>
          <span onClick={() => handleNav('/history')}>History</span>
          <span onClick={() => handleNav('/wishlist')}>Wishlist</span>
        </div>
        
        <div className="auth-menu">
          <button className="theme-toggle" onClick={() => { setDarkMode(!darkMode); setMobileMenuOpen(false); }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <button className="login-btn" onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</button>
          ) : (
            <button className="login-btn" onClick={() => handleNav('/login')}>Login / Register</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
