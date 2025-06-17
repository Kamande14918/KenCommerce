import React, { useState, useContext } from 'react';
import { createShop } from '../api/shops';
import { AuthContext } from '../contexts/AuthContext';

const CreateShop = ({ onShopCreated }) => {
  const { token: contextToken } = useContext(AuthContext);
  const token = contextToken || localStorage.getItem('token');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const shopData = { name, description };
      if (photo) shopData.photo = photo;
      console.log('Context token:', contextToken);
      console.log('LocalStorage token:', localStorage.getItem('token'));
      console.log('Using token:', token);
      await createShop(shopData, token);
      setName('');
      setDescription('');
      setPhoto(null);
      if (onShopCreated) onShopCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Create Shop</h2>
      <input type="text" placeholder="Shop Name" value={name} onChange={e => setName(e.target.value)} required className="form-input" />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="form-input" />
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="form-input" />
      <button type="submit" className="btn">Create</button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default CreateShop;