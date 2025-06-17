import axios from 'axios';

const API = 'http://localhost:5000/api/products';

// Create product (with images)
export const createProduct = async (productData, token) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'images' && Array.isArray(productData.images)) {
      productData.images.forEach(img => formData.append('images', img));
    } else {
      formData.append(key, productData[key]);
    }
  });
  return axios.post(API, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Fetch all products
export const fetchProducts = async () => {
    try {
        const response = await axios.get(API);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

// Fetch product details by ID
export const fetchProductById = async (productId) => {
    try {
        const response = await axios.get(`${API}/${productId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching product details: ' + error.message);
    }
};

// Search products by query
export const searchProducts = async (query) => {
    try {
        const response = await axios.get(`${API}/search`, { params: { query } });
        return response.data;
    } catch (error) {
        throw new Error('Error searching products: ' + error.message);
    }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
    try {
        const response = await axios.put(`${API}/${productId}`, productData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
};

// Delete a product
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API}/${productId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};

// Other product endpoints...
export const listProductsByShop = (shopId) => axios.get(`${API}/shop/${shopId}`);
export const listLatestProducts = () => axios.get(`${API}/latest`);
export const listRelatedProducts = (id) => axios.get(`${API}/related/${id}`);
export const listCategories = () => axios.get(`${API}/categories`);
export const removeProduct = (id, token) =>
  axios.delete(`${API}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
export const decreaseQuantity = (productId, amount, token) =>
  axios.post(`${API}/decrease`, { productId, amount }, { headers: { 'Authorization': `Bearer ${token}` } });
export const increaseQuantity = (productId, amount, token) =>
  axios.post(`${API}/increase`, { productId, amount }, { headers: { 'Authorization': `Bearer ${token}` } });