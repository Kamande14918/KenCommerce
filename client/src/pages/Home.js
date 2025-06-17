import React, { useEffect, useState } from 'react';
import ProductList from '../components/Products/ProductList';
import SearchBar from '../components/Products/SearchBar';
import { fetchProducts } from '../api/products';
import './Home.css';

const categories = [
  { name: 'Phones', icon: '📱' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Fashion', icon: '👗' },
  { name: 'Home', icon: '🏠' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Groceries', icon: '🛒' },
  // Add more as needed
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to KenCommerce</h1>
          <p>Shop the best deals, just like Jumia!</p>
          <a href="/products" className="hero-btn">Shop Now</a>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        {categories.map(cat => (
          <div className="category-card" key={cat.name}>
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </section>

      {/* Search Bar */}
      <div className="search-bar-wrapper">
        <SearchBar setProducts={setProducts} />
      </div>

      {/* Product List */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <ProductList products={products} />
        )}
      </section>
    </div>
  );
};

export default Home;