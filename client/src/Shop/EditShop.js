import React, { useState, useEffect } from 'react';
import { updateShop, getShopById } from '../api/shops';

const EditShop = ({ shopId, token, onShopUpdated }) => {
  const [fields, setFields] = useState({ name: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getShopById(shopId)
      .then(res => setFields({ name: res.data.name, description: res.data.description }))
      .catch(() => setError('Failed to load shop'));
  }, [shopId]);

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const shopData = { ...fields };
      if (photo) shopData.photo = photo;
      await updateShop(shopId, shopData, token);
      if (onShopUpdated) onShopUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shop');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Edit Shop</h2>
      <input name="name" value={fields.name} onChange={handleChange} placeholder="Shop Name" required className="form-input" />
      <textarea name="description" value={fields.description} onChange={handleChange} placeholder="Description" className="form-input" />
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="form-input" />
      <button type="submit" className="btn">Update Shop</button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default EditShop;