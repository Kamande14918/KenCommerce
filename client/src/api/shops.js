import axios from 'axios';

const API = 'http://localhost:5000/api/shops';

// Create a new shop (with photo)
export const createShop = async (shopData, token) => {
  const formData = new FormData();
  Object.keys(shopData).forEach(key => {
    formData.append(key, shopData[key]);
  });
  return axios.post('http://localhost:5000/api/shops', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// List all shops
export const listShops = () => axios.get(API);

// List shops by owner
export const listShopsByOwner = (token) =>
  axios.get(`${API}/owner`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

// Get shop by ID
export const getShopById = (id) => axios.get(`${API}/${id}`);

// Update shop
export const updateShop = (id, shopData, token) => {
  const formData = new FormData();
  Object.keys(shopData).forEach(key => {
    formData.append(key, shopData[key]);
  });
  return axios.put(`${API}/${id}`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Remove shop
export const removeShop = (id, token) =>
  axios.delete(`${API}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });