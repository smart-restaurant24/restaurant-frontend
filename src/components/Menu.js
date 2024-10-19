import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../css/Menu.css';
import Chatbot from './Chatbot';
import AIPrompts from './AIPrompts';
import { decryptId } from '../utils/encryption';

const API_URL = "http://localhost:8000";

const Menu = () => {
  const [cuisines, setCuisines] = useState([]);
  const [selectedTab, setSelectedTab] = useState('AI Server Recommendation');
  const [menuItems, setMenuItems] = useState([]);
  const [aiPrompts, setAiPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  const restaurantId = useMemo(() => {
    const encryptedId = window.location.pathname.slice(1);
    console.log('Restaurant ID:', encryptedId);
    return encryptedId;
  }, []);

  const fetchRestaurantInfo = useCallback(async () => {
    console.log('Fetching restaurant info... from ' + API_URL);
    try {
      const response = await axios.get(`${API_URL}/api/restaurant/${restaurantId}`);
      console.log('Restaurant info:', response.data);
      setRestaurantInfo(response.data);
    } catch (err) {
      console.error('Error fetching restaurant info:', err);
      setError('Failed to fetch restaurant information');
    }
  }, [restaurantId]);

  const fetchCuisines = useCallback(async () => {
    console.log('Fetching cuisines...');
    try {
      const response = await axios.get(`${API_URL}/api/cuisines/${restaurantId}`);
      console.log('Cuisines:', response.data);
      setCuisines(['AI Server Recommendation', ...response.data]);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cuisines:', err);
      setError('Failed to fetch cuisines');
    }
  }, [restaurantId]);

  const fetchAIPrompts = useCallback(async () => {
    console.log('Fetching AI prompts...');
    try {
      const response = await axios.get(`${API_URL}/api/ai-prompts/${restaurantId}`);
      console.log('AI prompts:', response.data);
      setAiPrompts(response.data);
    } catch (err) {
      console.error('Error fetching AI prompts:', err);
    }
  }, [restaurantId]);

  const fetchMenuItems = useCallback(async (cuisine) => {
    console.log(`Fetching menu items for cuisine: ${cuisine}`);
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/menu/${restaurantId}/${cuisine}`);
      console.log('Menu items:', response.data);
      setMenuItems(response.data);
      setError(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to fetch menu items');
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    console.log('Component mounted. Fetching initial data...');
    fetchRestaurantInfo();
    fetchCuisines();
    fetchAIPrompts();
  }, [fetchRestaurantInfo, fetchCuisines, fetchAIPrompts]);

  useEffect(() => {
    console.log('Selected tab changed:', selectedTab);
    if (selectedTab && selectedTab !== 'AI Server Recommendation') {
      fetchMenuItems(selectedTab);
    }
  }, [selectedTab, fetchMenuItems]);

  const handlePromptClick = useCallback((prompt) => {
    console.log('Prompt clicked:', prompt);
    setIsChatExpanded(true);
    setChatMessages(prevMessages => [...prevMessages, { text: prompt, sender: 'user' }]);
  }, []);

  const renderContent = useCallback(() => {
    console.log('Rendering content for tab:', selectedTab);
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (selectedTab === 'AI Server Recommendation') {
      return <AIPrompts prompts={aiPrompts} onPromptClick={handlePromptClick} />;
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
  }, [isLoading, error, selectedTab, aiPrompts, menuItems, handlePromptClick]);

  console.log('Restaurant info:', restaurantInfo);
  if (!restaurantInfo) {
    return <p>Loading restaurant information...</p>;
  }

  return (
    <div className="menu-container">
      <div className="fixed-header">
        <header>
          <div className="restaurant-info">
            <div className="logo">
              <img src={restaurantInfo.logo} alt={restaurantInfo.name} />
            </div>
            <h1>{restaurantInfo.name}</h1>
          </div>
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
      </div>
      
      <div className="scrollable-content">
        <div className="menu-section">
          {renderContent()}
        </div>
      </div>
      <Chatbot 
        isExpanded={isChatExpanded}
        setIsExpanded={setIsChatExpanded}
        messages={chatMessages} 
        setMessages={setChatMessages}
        restaurantId={restaurantId}
        />
    </div>
  );
};
export default Menu;