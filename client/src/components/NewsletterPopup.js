import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { useToast } from './Toast';

const NewsletterPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    // Only show if not previously dismissed
    const hasDismissed = localStorage.getItem('autonshop_newsletter');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('autonshop_newsletter', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email.includes('@')) {
      addToast("Subscribed successfully! Get ready for the best deals.");
      setTimeout(() => {
        handleDismiss();
      }, 2000);
    } else {
      addToast("Please enter a valid email.");
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content pop-in" style={{ padding: '40px', background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--bg) 100%)', border: '2px solid var(--primary)' }}>
          <button className="close-btn" onClick={handleDismiss}><X size={24}/></button>
          <Mail size={50} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Don't Miss a Deal!</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '30px', fontSize: '15px' }}>
            Subscribe to our newsletter and get the top price-dropped products sent straight to your inbox daily.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '16px', outline: 'none' }}
              required
            />
            <button type="submit" className="primary-btn" style={{ padding: '15px', fontSize: '16px' }}>
              Subscribe Now
            </button>
          </form>
          <p style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '20px' }}>
            We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default NewsletterPopup;
