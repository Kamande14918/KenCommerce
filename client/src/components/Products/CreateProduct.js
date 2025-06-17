import React, { useState, useEffect } from 'react';
import { createProduct } from '../../api/products';
import { listShopsByOwner } from '../../api/shops';
import './ProductForm.css';

const CreateProduct = ({ token, onProductCreated }) => {
  const [fields, setFields] = useState({ name: '', description: '', price: '', category: '', shop: '' });
  const [images, setImages] = useState([]);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listShopsByOwner(token)
      .then(res => setShops(res.data))
      .catch(() => setShops([]));
  }, [token]);

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });
  const handleImages = e => setImages([...e.target.files]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const productData = { ...fields, images };
      await createProduct(productData, token);
      setFields({ name: '', description: '', price: '', category: '', shop: '' });
      setImages([]);
      if (onProductCreated) onProductCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add Product</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <select name="shop" value={fields.shop} onChange={handleChange} required className="form-input">
          <option value="">Select Shop</option>
          {shops.map(shop => (
            <option key={shop._id} value={shop._id}>{shop.name}</option>
          ))}
        </select>
        <input name="name" value={fields.name} onChange={handleChange} placeholder="Product Name" required className="form-input" />
        <textarea name="description" value={fields.description} onChange={handleChange} placeholder="Description" className="form-input" />
        <input name="price" type="number" value={fields.price} onChange={handleChange} placeholder="Price" required className="form-input" />
        <input name="category" value={fields.category} onChange={handleChange} placeholder="Category" required className="form-input" />
        <input type="file" accept="image/*" multiple onChange={handleImages} className="form-input" />
        <button type="submit" className="btn">Add Product</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default CreateProduct;