import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chatbot'; // Adjust the URL as needed

// Function to send a query to the chatbot API
export const sendChatbotQuery = async (message) => {
    try {
        const response = await axios.post(`${API_URL}/query`, { message });
        return response.data;
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
        throw error;
    }
};

// Function to get chatbot suggestions
export const getChatbotSuggestions = async () => {
    try {
        const response = await axios.get(`${API_URL}/suggestions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chatbot suggestions:', error);
        throw error;
    }
};