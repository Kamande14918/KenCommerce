import React, { useEffect, useState } from 'react';
import { listShopsByOwner } from '../../api/shops';
import CreateShop from '../../Shop/CreateShop';
import ProductList from '../Products/ProductList';

const Dashboard = ({ token }) => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    listShopsByOwner(token)
      .then(res => setShops(res.data))
      .catch(() => setShops([]));
  }, [token]);

  return (
    <div className="dashboard-container">
      <h2>Seller Dashboard</h2>
      <CreateShop token={token} onShopCreated={() => window.location.reload()} />
      <div className="shop-list">
        <h3>Your Shops</h3>
        <ul>
          {shops.map(shop => (
            <li key={shop._id} onClick={() => setSelectedShop(shop._id)} className="shop-list-item">
              <img src={`http://localhost:5000${shop.photo}`} alt={shop.name} className="shop-list-image" />
              {shop.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedShop && (
        <div>
          <h3>Products in {shops.find(s => s._id === selectedShop)?.name}</h3>
          <ProductList shopId={selectedShop} token={token} isOwner={true} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;