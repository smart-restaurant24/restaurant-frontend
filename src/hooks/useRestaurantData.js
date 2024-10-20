import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export const useRestaurantData = (API_URL) => {
  const [cuisines, setCuisines] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [aiPrompts, setAiPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message:', error.message);
    }
      setError('Failed to fetch restaurant information');
    }
  }, [API_URL, restaurantId]);

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
  }, [API_URL, restaurantId]);

  const fetchAIPrompts = useCallback(async () => {
    console.log('Fetching AI prompts...');
    try {
      const response = await axios.get(`${API_URL}/api/ai-prompts/${restaurantId}`);
      console.log('AI prompts:', response.data);
      setAiPrompts(response.data);
    } catch (err) {
      console.error('Error fetching AI prompts:', err);
    }
  }, [API_URL, restaurantId]);

  const fetchMenuItems = useCallback(async (cuisine) => {
    console.log(`Fetching menu items for cuisine: ${cuisine}`);
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/menu/${restaurantId}/${cuisine}`);
      console.log('Menu items:', response.data);
      setMenuItems(response.data);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to fetch menu items');
      setIsLoading(false);
    }
  }, [API_URL, restaurantId]);

  useEffect(() => {
    console.log('Component mounted. Fetching initial data...');
    fetchRestaurantInfo();
    fetchCuisines();
    fetchAIPrompts();
  }, [fetchRestaurantInfo, fetchCuisines, fetchAIPrompts]);

  return {
    restaurantInfo,
    cuisines,
    menuItems,
    aiPrompts,
    isLoading,
    error,
    fetchMenuItems,
    restaurantId
  };
};