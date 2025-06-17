import React, { useState, useEffect } from 'react';
import { updateProduct, fetchProductById } from '../../api/products';

const EditProduct = ({ productId, token, onProductUpdated }) => {
  const [fields, setFields] = useState({ name: '', description: '', price: '', category: '' });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductById(productId)
      .then(data => setFields({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category
      }))
      .catch(() => setError('Failed to load product'));
  }, [productId]);

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });
  const handleImages = e => setImages([...e.target.files]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const productData = { ...fields, images };
      await updateProduct(productId, productData, token);
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Edit Product</h2>
      <input name="name" value={fields.name} onChange={handleChange} placeholder="Product Name" required className="form-input" />
      <textarea name="description" value={fields.description} onChange={handleChange} placeholder="Description" className="form-input" />
      <input name="price" type="number" value={fields.price} onChange={handleChange} placeholder="Price" required className="form-input" />
      <input name="category" value={fields.category} onChange={handleChange} placeholder="Category" required className="form-input" />
      <input type="file" accept="image/*" multiple onChange={handleImages} className="form-input" />
      <button type="submit" className="btn">Update Product</button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default EditProduct;