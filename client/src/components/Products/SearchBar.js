import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ setProducts }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    // You can implement your search logic here, e.g., call an API
    // setProducts(await searchProducts(query));
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <input
        type="text"
        className="searchbar-input"
        placeholder="Search for products, brands and more..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button className="searchbar-btn" type="submit">
        <span role="img" aria-label="search">🔍</span>
      </button>
    </form>
  );
};

export default SearchBar;