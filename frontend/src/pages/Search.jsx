import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery().get('q') || '';
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      axios.get(`/api/products/search?q=${encodeURIComponent(query)}`)
        .then(res => setProducts(res.data.products || []));
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
