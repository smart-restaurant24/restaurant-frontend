import React, { useState, useEffect } from 'react';
import '../css/Menu.css';
import Chatbot from './Chatbot';
import { mockCuisines, mockMenuItems, mockAIPrompts } from './mockApiData';

const Menu = () => {
  const [cuisines, setCuisines] = useState([]);
  const [selectedTab, setSelectedTab] = useState('AI Server Recommendation');
  const [menuItems, setMenuItems] = useState([]);
  const [aiPrompts, setAiPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    fetchCuisines();
    fetchAIPrompts();
  }, []);

  useEffect(() => {
    if (selectedTab) {
      fetchMenuItems(selectedTab);
    }
  }, [selectedTab]);

  const fetchCuisines = () => {
    setTimeout(() => {
      setCuisines(['AI Server Recommendation', ...mockCuisines]);
      setIsLoading(false);
    }, 500);
  };

  const fetchAIPrompts = () => {
    setTimeout(() => {
      setAiPrompts(mockAIPrompts);
    }, 500);
  };

  const fetchMenuItems = (tab) => {
    setIsLoading(true);
    setTimeout(() => {
      if (tab !== 'AI Server Recommendation') {
        setMenuItems(mockMenuItems[tab] || []);
      }
      setIsLoading(false);
    }, 500);
  };

  const handlePromptClick = (prompt) => {
    setIsChatExpanded(true);
    setChatMessages(prevMessages => [...prevMessages, { text: prompt, sender: 'user' }]);
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (selectedTab === 'AI Server Recommendation') {
      return (
        <div className="ai-recommendation-content">
          <h2>Feeling lost? Explore Dish Recommendation!</h2>
          {aiPrompts.map((prompt, index) => (
            <div key={index} className="ai-prompt" onClick={() => handlePromptClick(prompt)}>
              {prompt}
            </div>
          ))}
        </div>
      );
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
              <button>+</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={`content-wrapper ${isChatExpanded ? 'chat-expanded' : ''}`}>
        <div className="menu-container">
          <header>
            <div className="restaurant-info">
              <div className="logo">🍔</div>
              <h1>Tasty Bites</h1>
            </div>
            <button className="profile-button">👤</button>
          </header>
          
          <div className="category-tabs">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                className={`${selectedTab === cuisine ? 'active' : ''} ${cuisine === 'AI Server Recommendation' ? 'ai-recommendation' : ''}`}
                onClick={() => setSelectedTab(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
          
          <div className="menu-section">
            {renderContent()}
          </div>
        </div>
      </div>
      <Chatbot 
        isExpanded={isChatExpanded}
        setIsExpanded={setIsChatExpanded}
        messages={chatMessages} 
        setMessages={setChatMessages}
      />
    </>
  );
};

export default Menu;