import React from 'react';
import { X } from 'lucide-react';

const CompareModal = ({ items, onClose }) => {
  if (!items || items.length < 2) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
        <button className="close-btn" onClick={onClose}><X size={24}/></button>
        <h2>Side-by-Side Comparison</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
          {items.map((item, idx) => {
            const source = item.source.toLowerCase();
            const q = encodeURIComponent(item.title);
            let link = `https://www.google.com/search?tbm=shop&q=${q}`;
            if (source.includes('amazon')) link = `https://www.amazon.in/s?k=${q}`;
            else if (source.includes('flipkart')) link = `https://www.flipkart.com/search?q=${q}`;
            else if (source.includes('croma')) link = `https://www.croma.com/searchB?q=${q}`;
            
            return (
              <div key={idx} style={{ flex: '1 1 300px', border: '1px solid var(--border-color)', borderRadius: '15px', padding: '20px', textAlign: 'center', background: 'var(--card-bg)' }}>
                <img src={item.image} alt={item.title} style={{ maxHeight: '150px', objectFit: 'contain', marginBottom: '15px' }} />
                <h3 style={{ fontSize: '16px', minHeight: '40px' }}>{item.title}</h3>
                <h1 style={{ color: 'var(--primary)', margin: '15px 0' }}>{item.price}</h1>
                <p style={{ color: 'var(--gray)', fontWeight: 600 }}>{item.source}</p>
                <div style={{ margin: '15px 0', padding: '5px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'inline-block', borderRadius: '5px', fontWeight: 600 }}>
                   {item.deal_rating}
                </div>
                <a href={link} target="_blank" rel="noreferrer" style={{ display: 'block', background: 'var(--blue)', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, marginTop: '10px' }}>Buy Now</a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
