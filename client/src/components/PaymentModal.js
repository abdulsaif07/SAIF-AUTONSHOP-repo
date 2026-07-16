import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Wallet, Smartphone, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const PaymentModal = ({ onClose, onSuccess }) => {
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const { subscribeUser } = useAuth();
  const { addToast, ToastContainer } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    // Simulate network delay for payment gateway
    setTimeout(async () => {
      try {
        await subscribeUser();
        setLoading(false);
        if(onSuccess) onSuccess();
      } catch (err) {
        setLoading(false);
        addToast("Payment failed. Please try again.");
      }
    }, 2000);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content pop-in" style={{ padding: '30px', textAlign: 'left', maxWidth: '400px' }}>
          <button className="close-btn" onClick={onClose}><X size={24}/></button>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'var(--primary)', color: 'white', display: 'inline-flex', padding: '15px', borderRadius: '50%', marginBottom: '10px' }}>
              <ShieldCheck size={40} />
            </div>
            <h2 style={{ margin: '0 0 5px 0' }}>Unlock Price Alerts</h2>
            <p style={{ color: 'var(--gray)', margin: 0 }}>Premium Monthly Subscription</p>
            <h1 style={{ fontSize: '36px', color: 'var(--text)', margin: '15px 0' }}>₹99<span style={{ fontSize: '16px', color: 'var(--gray)' }}>/month</span></h1>
            <p style={{ fontSize: '12px', color: 'var(--primary)', background: 'var(--card-bg)', border: '1px solid var(--primary)', padding: '5px 10px', borderRadius: '15px', display: 'inline-block' }}>Cancel anytime. No hidden fees.</p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--gray)' }}>Select Payment Method</h4>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: `2px solid ${method === 'upi' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', transition: '0.2s' }}>
              <input type="radio" name="payment" checked={method === 'upi'} onChange={() => setMethod('upi')} style={{ accentColor: 'var(--primary)' }} />
              <Smartphone size={24} color={method === 'upi' ? 'var(--primary)' : 'var(--gray)'} />
              <span style={{ fontWeight: 600 }}>UPI (GPay, PhonePe, Paytm)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: `2px solid ${method === 'card' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', transition: '0.2s' }}>
              <input type="radio" name="payment" checked={method === 'card'} onChange={() => setMethod('card')} style={{ accentColor: 'var(--primary)' }} />
              <CreditCard size={24} color={method === 'card' ? 'var(--primary)' : 'var(--gray)'} />
              <span style={{ fontWeight: 600 }}>Credit / Debit Card</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: `2px solid ${method === 'wallet' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}>
              <input type="radio" name="payment" checked={method === 'wallet'} onChange={() => setMethod('wallet')} style={{ accentColor: 'var(--primary)' }} />
              <Wallet size={24} color={method === 'wallet' ? 'var(--primary)' : 'var(--gray)'} />
              <span style={{ fontWeight: 600 }}>Wallets (Amazon Pay, MobiKwik)</span>
            </label>
          </div>

          <button className="primary-btn" onClick={handlePayment} disabled={loading} style={{ width: '100%', padding: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'Processing...' : <><Lock size={18} /> Pay ₹99 Securely</>}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
             <p style={{ fontSize: '12px', color: 'var(--gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', margin: '0 0 5px 0' }}>
               <ShieldCheck size={14} color="#10B981" /> 100% Secure SSL Payment Processing
             </p>
             <p style={{ fontSize: '11px', color: 'var(--gray)', margin: 0 }}>Your data is encrypted. We do not store your card details.</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PaymentModal;
