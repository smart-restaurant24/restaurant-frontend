import React, { useState, useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import '../css/Chatbot.css';

const API_URL =  'http://localhost:8000';

const Chatbot = ({ isExpanded, setIsExpanded, messages, setMessages, restaurantId }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const viewportHeight = window.innerHeight;
      const lastMessageHeight = lastMessageRef.current.offsetHeight;
      const keyboardHeight = viewportHeight - window.visualViewport.height;
      chatContainerRef.current.style.height = `${isExpanded ? lastMessageHeight + 150 : 50}px`;
      chatContainerRef.current.style.bottom = `${keyboardHeight}px`;
    }
    else if(!isExpanded){
      chatContainerRef.current.style.height = `50px`;
    }
  }, [isExpanded, lastMessageRef, chatContainerRef]);

  useEffect(() => {
    // Call handleResize immediately when the component mounts or isExpanded changes
    handleResize();

    // Add event listeners
    window.visualViewport.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listeners
    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
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
    <div ref={chatContainerRef} className={`chat-container ${isExpanded ? 'expanded' : ''}`}>
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