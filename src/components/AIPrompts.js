import React, { useState, useEffect } from 'react';
import '../css/AIPrompts.css';

const AIPrompts = ({ prompts, onPromptClick }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ai-recommendation-content">
      <h2>Feeling lost? Explore Dish Recommendation!</h2>
      {prompts.map((prompt, index) => (
        <div 
          key={index} 
          className={`ai-prompt ${animate ? 'animate' : ''}`} 
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onPromptClick(prompt)}
        >
          {prompt}
        </div>
      ))}
    </div>
  );
};

export default AIPrompts;