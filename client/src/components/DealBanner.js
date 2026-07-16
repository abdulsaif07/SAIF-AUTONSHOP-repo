import React from 'react';

const DealBanner = ({ featuredDeal, searchProducts }) => {
  if (!featuredDeal) return null;

  return (
    <div className="banner" style={{
      background: 'var(--primary)', 
      color: '#333333', 
      padding: '40px', 
      borderRadius: '20px', 
      marginBottom: '40px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      flexWrap: 'wrap', 
      gap: '20px',
      boxShadow: '0 20px 40px var(--shadow-color)'
    }}>
      <div style={{flex: '1 1 300px'}}>
        <span style={{background: 'rgba(51, 51, 51, 0.1)', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>
          DEAL OF THE DAY
        </span>
        <h1 style={{fontSize: '36px', margin: '15px 0', color: '#333333'}}>{featuredDeal.title}</h1>
        <p style={{fontSize: '18px', opacity: 0.9, marginBottom: '20px'}}>
          Grab the absolute lowest price on the market. Normally ₹{(featuredDeal.price.replace(/[^0-9]/g, '') * 1.2).toFixed(0)}, now just {featuredDeal.price}.
        </p>
        <button 
          className="primary-btn banner-btn" 
          onClick={() => searchProducts(featuredDeal.query)} 
          style={{background: '#333333', color: 'white', fontWeight: 700}}
        >
          Claim Now
        </button>
      </div>
      <img src={featuredDeal.image} alt="Deal" style={{maxHeight: '200px', objectFit: 'contain', mixBlendMode: 'multiply', borderRadius: '15px'}}/>
    </div>
  );
};

export default React.memo(DealBanner);
