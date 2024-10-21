import React, { useState, useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import '../css/Chatbot.css';

const API_URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Chatbot = ({ isExpanded, setIsExpanded, messages, setMessages, restaurantId }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newKeyboardHeight = window.innerHeight - window.visualViewport.height;
      setKeyboardHeight(newKeyboardHeight);
    };

    // window.visualViewport.addEventListener('resize', handleResize);
    // return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  const handleResize = useCallback(() => {
    if (isExpanded && lastMessageRef.current && chatContainerRef.current) {
      console.log("inside:", isExpanded);
      const lastMessageHeight = lastMessageRef.current.offsetHeight;
      const newHeight = isExpanded ? Math.max(lastMessageHeight + 150, 300) : 50;
      chatContainerRef.current.style.height = `${newHeight}px`;
      chatContainerRef.current.style.bottom = `${keyboardHeight}px`;
    }
    else if(!isExpanded){
      chatContainerRef.current.style.height = `50px`;
    }
  }, [isExpanded, lastMessageRef, chatContainerRef,keyboardHeight]);

  useEffect(() => {
    // Call handleResize immediately when the component mounts or isExpanded changes
    handleResize();

    // Add event listeners
  }, [handleResize,isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      handleResize();
    }
  }, [messages, isExpanded, handleResize]);

  const generateResponse = useCallback(async (userMessage) => {
    try {
      console.log(userMessage)
      const response = await axios.post(`${API_URL}/api/chat/${restaurantId}`, { message: userMessage });
      console.log(response)
            setMessages(prevMessages => [...prevMessages, { text: response.data.text, sender: 'bot' }]);
      handleResize()
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { text: "Sorry, I'm having trouble responding right now.", sender: 'bot' }]);
    }
  }, [restaurantId, setMessages,handleResize]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      generateResponse(lastMessage.text);
    }
  }, [messages, generateResponse]);

  const handleSend = useCallback(() => {
    if (inputMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      setIsExpanded(true);
      resetTranscript();
    }
  }, [inputMessage, setMessages, resetTranscript, setIsExpanded]);

  const toggleExpand = useCallback(() => {
    console.log("before" + isExpanded)
    setIsExpanded(prev => !prev);
    console.log("after" + isExpanded)
    // handleResize();
  }, [setIsExpanded,isExpanded]);


  const startListening = useCallback(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  }, [browserSupportsSpeechRecognition]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    handleSend();
  }, [handleSend]);

  return (
    <div ref={chatContainerRef} className={`chat-container ${isExpanded ? 'expanded' : ''}`}
    style={{ position: 'fixed', bottom: `${keyboardHeight}px`, left: 0, right: 0, transition: 'all 0.3s ease-out' }}>
      {isExpanded && (
        <>
          <div className="chat-header">
            <button className="collapse-button" onClick={toggleExpand}>
              &#8595;
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}
              ref={index === messages.length - 1 ? lastMessageRef : null}>
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
          onClick={(e) => e.stopPropagation()}
        />
        <button className="send-button" onClick={(e) => { e.stopPropagation(); handleSend();}}>
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