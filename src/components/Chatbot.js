import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../css/Chatbot.css';

const Chatbot = ({ isExpanded, setIsExpanded, messages, setMessages }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      generateResponse(messages[messages.length - 1].text);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResponse = (userMessage) => {
    setTimeout(() => {
      let response;
      if (userMessage.toLowerCase().includes('light lunch')) {
        response = "For a light lunch, I'd recommend our Caprese Salad or the Grilled Chicken Wrap. Both are delicious and won't leave you feeling too full.";
      } else if (userMessage.toLowerCase().includes('spicy')) {
        response = "If you enjoy spicy food, you might like our Spicy Chicken Tacos or the Jalapeño Burger. Both pack a nice kick!";
      } else {
        response = "Thank you for your question. Our chef recommends trying the Daily Special, which is always a great choice!";
      }
      setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
    }, 1000);
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      setIsExpanded(true);
      setMessages(prevMessages => [...prevMessages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      resetTranscript();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    handleSend();
  };

  return (
    <div className={`chat-container ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded && (
        <>
          <div className="chat-header">
            <button className="collapse-button" onClick={toggleExpand}>
              &#8595; {/* Down arrow Unicode character */}
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </>
      )}
      <div className="chat-input-container" onClick={() => !isExpanded && setIsExpanded(true)}>
        <input 
          type="text" 
          placeholder="Send a message..." 
          className="chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          onClick={(e) => e.stopPropagation()} // Prevent input click from toggling expand
        />
        <button className="send-button" onClick={(e) => { e.stopPropagation(); handleSend(); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
          </svg>
        </button>
        <button 
          className={`mic-button ${listening ? 'listening' : ''}`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            listening ? stopListening() : startListening(); 
          }}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default Chatbot;