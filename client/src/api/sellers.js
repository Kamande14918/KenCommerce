import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sellers';

// Function to fetch all sellers
export const fetchSellers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching sellers: ' + error.message);
    }
};

// Function to fetch a seller by ID
export const fetchSellerById = async (sellerId) => {
    try {
        const response = await axios.get(`${API_URL}/${sellerId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching seller: ' + error.message);
    }
};

// Function to create a new seller
export const createSeller = async (sellerData) => {
    try {
        const response = await axios.post(API_URL, sellerData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating seller: ' + error.message);
    }
};

// Function to update a seller
export const updateSeller = async (sellerId, sellerData) => {
    try {
        const response = await axios.put(`${API_URL}/${sellerId}`, sellerData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating seller: ' + error.message);
    }
};

// Function to delete a seller
export const deleteSeller = async (sellerId) => {
    try {
        const response = await axios.delete(`${API_URL}/${sellerId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting seller: ' + error.message);
    }
};