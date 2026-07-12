import React from 'react';

const CATEGORIES = [
  { name: "Electronics", icon: "📱", query: "Best Electronics Deals" },
  { name: "Fashion", icon: "👕", query: "Trending Fashion Men Women" },
  { name: "Home & Kitchen", icon: "🏠", query: "Home Kitchen Appliances" },
  { name: "Beauty", icon: "💄", query: "Beauty Products Best Sellers" },
  { name: "Sneakers", icon: "👟", query: "Best Sneakers for Men" },
  { name: "Laptops", icon: "💻", query: "Best Gaming Laptops" }
];

const CategoryGrid = ({ searchProducts }) => {
  return (
    <div className="main-content fade-in">
       <div className="section-header">
           <h2>Explore Categories</h2>
           <p>Select a category to find the best market prices</p>
       </div>
       <div className="category-grid">
           {CATEGORIES.map((cat, idx) => (
               <div key={idx} className="category-card" onClick={() => searchProducts(cat.query)}>
                   <span className="cat-icon">{cat.icon}</span><h3>{cat.name}</h3>
               </div>
           ))}
       </div>
    </div>
  );
};

export default React.memo(CategoryGrid);
