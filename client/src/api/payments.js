import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

// Function to initiate a payment
export const initiatePayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/initiate`, paymentData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error initiating payment');
    }
};

// Function to check payment status
export const getPaymentStatus = async (paymentId) => {
    try {
        const response = await axios.get(`${API_URL}/status/${paymentId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error fetching payment status');
    }
};

// Function to process a payment
export const processPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/process`, paymentData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error processing payment');
    }
};

// Function to refund a payment
export const refundPayment = async (paymentId) => {
    try {
        const response = await axios.post(`${API_URL}/refund`, { paymentId });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error refunding payment');
    }
};