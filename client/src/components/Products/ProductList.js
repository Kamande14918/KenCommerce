import React, { useEffect, useState } from 'react';
import { listProductsByShop } from '../../api/products';
import './index.css';

const ProductList = ({ shopId, token, isOwner, onEdit, onRemove }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shopId) {
      listProductsByShop(shopId)
        .then(res => setProducts(res.data))
        .catch(() => setProducts([]));
    }
  }, [shopId]);

  return (
    <div className="product-list">
      {error && <div className="error-message">{error}</div>}
      <div className="product-list-grid">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            {product.images && product.images.length > 0 && (
              <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="product-image" />
            )}
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">${product.price}</p>
              {isOwner && (
                <div className="product-actions">
                  <button className="btn btn-edit" onClick={() => onEdit(product)}>Edit</button>
                  <button className="btn btn-remove" onClick={() => onRemove(product._id)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;