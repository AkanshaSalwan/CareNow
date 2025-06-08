import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your appointment assistant. How can I help you today?",
      isBot: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const commonQuestions = [
    "How do I book an appointment?",
    "What are your working hours?",
    "How can I cancel my appointment?",
    "What documents do I need to bring?",
    "How much does a consultation cost?"
  ];

  const getBotResponse = (question) => {
    const responses = {
      "how do i book an appointment": "You can book an appointment by clicking on the 'Book Appointment' button on our website, or by calling our reception at (555) 123-4567. You can also use our mobile app for quick booking!",
      "what are your working hours": "Our clinic is open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.",
      "how can i cancel my appointment": "You can cancel your appointment by calling our reception at least 24 hours before your scheduled time. You can also cancel through our website or mobile app.",
      "what documents do i need to bring": "Please bring your ID proof, insurance card (if applicable), previous medical records, and any current medications you're taking.",
      "how much does a consultation cost": "The consultation fee varies by specialty. General consultation starts at $50, while specialist consultations range from $75 to $150. Please contact our reception for specific pricing."
    };

    const lowerQuestion = question.toLowerCase();
    for (let key in responses) {
      if (lowerQuestion.includes(key)) {
        return responses[key];
      }
    }
    return "I'm sorry, I don't have information about that. Please contact our reception at (555) 123-4567 for assistance.";
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { text: inputText, isBot: false }]);
    
    // Get and add bot response
    const response = getBotResponse(inputText);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 500);

    setInputText('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button 
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
        >
          <span style={{ fontSize: '24px' }}>💬</span>
        </button>
      )}
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Appointment Assistant</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-questions">
            {commonQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputText(question);
                  handleSend();
                }}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question here..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 