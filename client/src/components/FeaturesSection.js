import React from 'react';
import { TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <div className="features-section">
      <div className="section-header">
          <h2>Why use Autonshop?</h2>
          <p>We do the hard work so you save money instantly.</p>
      </div>
      <div className="features-grid">
          <div className="feature-card">
              <div className="feature-icon"><TrendingUp size={32}/></div>
              <h3>Real-Time Comparison</h3>
              <p>We scan top retailers in milliseconds to find the absolute lowest price.</p>
          </div>
          <div className="feature-card">
              <div className="feature-icon"><BarChart3 size={32}/></div>
              <h3>30-Day Price History</h3>
              <p>Check the price graph to know if it's a good time to buy or if you should wait.</p>
          </div>
          <div className="feature-card">
              <div className="feature-icon"><ShieldCheck size={32}/></div>
              <h3>Deal Rating AI</h3>
              <p>Our algorithm rates every price as "Fair", "Great Deal", or "Overpriced" instantly.</p>
          </div>
      </div>
    </div>
  );
};

export default React.memo(FeaturesSection);
