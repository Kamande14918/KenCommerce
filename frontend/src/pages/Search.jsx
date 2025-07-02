import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const q = query.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(`/api/products/search?q=${encodeURIComponent(q)}`);
        setProducts(data);
      } catch (err) {
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };
    if (q) fetchResults();
    else setLoading(false);
  }, [q]);

  if (loading) return <div className="text-center py-10">Searching...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{q}"</h1>
      {products.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
              <Link to={`/products/${product.slug || product._id}`}>
                <img src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} className="w-full h-48 object-cover rounded mb-3" />
                <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
              </Link>
              <div className="flex-1" />
              <div className="mt-2">
                <span className="text-primary-600 font-bold text-xl">${product.price}</span>
                <span className={`ml-2 text-sm ${product.inventory?.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.inventory?.stock > 0 ? `In Stock: ${product.inventory.stock}` : 'Out of Stock'}</span>
              </div>
              <Link to={`/products/${product.slug || product._id}`} className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 text-center">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
