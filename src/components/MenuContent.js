import React from 'react';
import AIPrompts from './AIPrompts';
import '../css/MenuContent.css';

const MenuContent = ({ selectedTab, menuItems, aiPrompts, isLoading, error, onPromptClick }) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (selectedTab === 'AI Server Recommendation') {
    return <AIPrompts prompts={aiPrompts} onPromptClick={onPromptClick} />;
  }

  return (
    <div className="food-grid">
      {menuItems.map((item, index) => (
        <div key={index} className="food-item">
          <img src={item.image} alt={item.name} />
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="price-add">
            <span>{item.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuContent;