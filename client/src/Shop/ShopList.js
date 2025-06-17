import React, { useEffect, useState } from 'react';
import { listShops } from '../api/shops';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listShops()
      .then(res => setShops(res.data))
      .catch(() => setShops([]));
  }, []);

  return (
    <div className="shop-list-container">
      <h2>All Shops</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="shop-list-grid">
        {shops.map(shop => (
          <div className="shop-card" key={shop._id}>
            <img src={`http://localhost:5000${shop.photo}`} alt={shop.name} className="shop-image" />
            <div className="shop-info">
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
              <a href={`/shop/${shop._id}/products`} className="btn">View Products</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopList;