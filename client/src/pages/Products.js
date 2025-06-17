import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="products-page-container">
      <h1 className="products-title">All Products</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul className="products-grid">
          {products.length === 0 ? (
            <p>No products available at the moment.</p>
          ) : (
            products.map(product => (
              <li className="product-card" key={product._id}>
                <img
                  src={product.image || '/default-product.png'}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="product-price">Ksh {product.price}</p>
                <p className="product-desc">{product.description}</p>
                <a href={`/products/${product._id}`} className="view-btn">View</a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Products;