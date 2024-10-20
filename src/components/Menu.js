import React, { useState, useCallback } from 'react';
import '../css/Layout.css';
import Chatbot from './Chatbot';
import { useRestaurantData } from '../hooks/useRestaurantData';
import Header from './Header';
import CategoryTabs from './CategoryTabs';
import MenuContent from './MenuContent';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Menu = () => {
  const [selectedTab, setSelectedTab] = useState('AI Server Recommendation');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const { 
    restaurantInfo, 
    cuisines, 
    menuItems, 
    aiPrompts, 
    isLoading, 
    error,
    fetchMenuItems,
    restaurantId
  } = useRestaurantData(API_URL);

  const handleTabChange = useCallback((cuisine) => {
    setSelectedTab(cuisine);
    if (cuisine !== 'AI Server Recommendation') {
      fetchMenuItems(cuisine);
    }
  }, [fetchMenuItems]);

  const handlePromptClick = useCallback((prompt) => {
    setIsChatExpanded(true);
    setChatMessages(prevMessages => [...prevMessages, { text: prompt, sender: 'user' }]);
  }, []);

  if (!restaurantInfo) {
    return <p>Loading restaurant information...</p>;
  }

  return (
    <>
    <div className="fixed-header">
    <Header restaurantInfo={restaurantInfo} />
    <CategoryTabs 
      cuisines={cuisines} 
      selectedTab={selectedTab} 
      onTabChange={handleTabChange} 
    />
  </div>
    <div className="menu-container">
      <div className={`scrollable-content ${isChatExpanded ? 'chat-expanded' : ''}`}>
        <MenuContent 
          selectedTab={selectedTab}
          menuItems={menuItems}
          aiPrompts={aiPrompts}
          isLoading={isLoading}
          error={error}
          onPromptClick={handlePromptClick}
        />
      </div>

      <Chatbot 
        isExpanded={isChatExpanded}
        setIsExpanded={setIsChatExpanded}
        messages={chatMessages} 
        setMessages={setChatMessages}
        restaurantId={restaurantId}
      />
    </div>
    </>
  );
};

export default Menu;