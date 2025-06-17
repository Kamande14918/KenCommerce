import React, { useState } from 'react';
import './ChatbotWidget.css'; // Importing styles for the chatbot widget

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setUserMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (userMessage.trim() === '') return;

        const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
        setChatHistory(newChatHistory);
        setUserMessage('');

        // Simulate a response from the chatbot
        const response = await fetchChatbotResponse(userMessage);
        setChatHistory([...newChatHistory, { sender: 'bot', message: response }]);
    };

    const fetchChatbotResponse = async (message) => {
        // Replace with actual API call to your chatbot service
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`Chatbot response to: ${message}`);
            }, 1000);
        });
    };

    return (
        <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
            <button className="chatbot-toggle" onClick={toggleChatbot}>
                {isOpen ? 'Close Chat' : 'Chat with us'}
            </button>
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chat-history">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`chat-message ${chat.sender}`}>
                                {chat.message}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;