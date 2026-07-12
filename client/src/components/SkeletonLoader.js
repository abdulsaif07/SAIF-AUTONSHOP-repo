import React from 'react';
import '../App.css'; // Assuming skeleton styles are here

const SkeletonCard = () => {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="info">
        <div className="skeleton skeleton-text" style={{width: '80%', marginBottom: '10px'}}></div>
        <div className="skeleton skeleton-text" style={{width: '60%', marginBottom: '15px'}}></div>
        <div className="price-row">
          <div className="skeleton skeleton-text" style={{width: '40%', height: '20px'}}></div>
          <div className="skeleton skeleton-text" style={{width: '30%', height: '20px', borderRadius: '10px'}}></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="product-list">
       {Array.from({ length: count }).map((_, idx) => (
           <SkeletonCard key={idx} />
       ))}
    </div>
  );
};

export default React.memo(SkeletonLoader);
