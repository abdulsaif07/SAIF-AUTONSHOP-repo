import React from 'react';

const TrendingGrid = ({ dailyDeals, searchProducts }) => {
  if (!dailyDeals || dailyDeals.length === 0) return null;

  return (
    <>
      <div className="section-header">
          <h2>🔥 Trending Deals Today</h2>
          <p>Best prices tracked across Amazon, Flipkart & more</p>
      </div>
      <div className="trending-grid">
          {dailyDeals.map((deal, idx) => (
              <div key={idx} className="trend-card" onClick={() => searchProducts(deal.query)}>
                  <div className="trend-tag">{deal.tag}</div>
                  <img src={deal.image} alt={deal.title} className="trend-img" />
                  <h3>{deal.title}</h3>
                  <div className="price-row">
                      <span className="price">{deal.price}</span>
                      <span className="store-badge">Compare &rarr;</span>
                  </div>
              </div>
          ))}
      </div>
    </>
  );
};

export default React.memo(TrendingGrid);
