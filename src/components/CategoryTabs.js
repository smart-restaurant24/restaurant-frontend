import React from 'react';
import '../css/CategoryTabs.css';

const CategoryTabs = ({ cuisines, selectedTab, onTabChange }) => (
  <div className="category-tabs">
    {cuisines.map((cuisine) => (
      <button
        key={cuisine}
        className={`${selectedTab === cuisine ? 'active' : ''} ${cuisine === 'AI Server Recommendation' ? 'ai-recommendation' : ''}`}
        onClick={() => onTabChange(cuisine)}
      >
        {cuisine}
      </button>
    ))}
  </div>
);

export default CategoryTabs;