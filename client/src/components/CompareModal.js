import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const CompareModal = ({ items, onClose }) => {
  if (!items || items.length < 2) return null;

  const item1 = items[0];
  const item2 = items[1];

  // Determine winner based on raw price
  const isItem1Winner = item1.raw_price < item2.raw_price;
  const isItem2Winner = item2.raw_price < item1.raw_price;

  const getLink = (item) => {
    const source = item.source.toLowerCase();
    const q = encodeURIComponent(item.title);
    if (source.includes('amazon')) return `https://www.amazon.in/s?k=${q}`;
    if (source.includes('flipkart')) return `https://www.flipkart.com/search?q=${q}`;
    if (source.includes('croma')) return `https://www.croma.com/searchB?q=${q}`;
    return `https://www.google.com/search?tbm=shop&q=${q}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content pop-in" style={{ maxWidth: '900px', width: '95%', padding: '40px' }}>
        <button className="close-btn" onClick={onClose}><X size={24}/></button>
        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Head-to-Head Comparison</h2>
        
        <div className="compare-matrix" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Header Row: Images & Titles */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 0.3 }}></div>
            {[item1, item2].map((item, idx) => (
              <div key={idx} style={{ flex: 1, textAlign: 'center', position: 'relative', padding: '20px', background: 'var(--input-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                {(idx === 0 && isItem1Winner) || (idx === 1 && isItem2Winner) ? (
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)', zIndex: 10 }}>
                    <CheckCircle2 size={16}/> Best Value
                  </div>
                ) : null}
                <img src={item.image} alt={item.title} style={{ maxHeight: '140px', objectFit: 'contain', marginBottom: '15px' }} />
                <h3 style={{ fontSize: '16px', margin: 0, minHeight: '40px' }}>{item.title}</h3>
              </div>
            ))}
          </div>

          {/* Row: Price */}
          <div style={{ display: 'flex', gap: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '12px', alignItems: 'center' }}>
            <div style={{ flex: 0.3, fontWeight: 700, color: 'var(--gray)' }}>Price</div>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '24px', fontWeight: 800, color: isItem1Winner ? '#10B981' : 'var(--text)' }}>{item1.price}</div>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '24px', fontWeight: 800, color: isItem2Winner ? '#10B981' : 'var(--text)' }}>{item2.price}</div>
          </div>

          {/* Row: Store */}
          <div style={{ display: 'flex', gap: '20px', padding: '15px', alignItems: 'center' }}>
            <div style={{ flex: 0.3, fontWeight: 700, color: 'var(--gray)' }}>Store</div>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>{item1.source}</div>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>{item2.source}</div>
          </div>

          {/* Row: Deal Rating */}
          <div style={{ display: 'flex', gap: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '12px', alignItems: 'center' }}>
            <div style={{ flex: 0.3, fontWeight: 700, color: 'var(--gray)' }}>Deal Rating</div>
            <div style={{ flex: 1, textAlign: 'center' }}>
               <span className="badge fair-price" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>{item1.deal_rating}</span>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
               <span className="badge fair-price" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>{item2.deal_rating}</span>
            </div>
          </div>

          {/* Row: Action Buttons */}
          <div style={{ display: 'flex', gap: '20px', padding: '15px', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ flex: 0.3 }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <a href={getLink(item1)} target="_blank" rel="noreferrer" className="primary-btn" style={{ textDecoration: 'none', display: 'block' }}>Buy Now</a>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <a href={getLink(item2)} target="_blank" rel="noreferrer" className="primary-btn" style={{ textDecoration: 'none', display: 'block' }}>Buy Now</a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
