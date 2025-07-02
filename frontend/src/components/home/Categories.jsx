import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/categories')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          setCategories([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setError('Failed to load categories.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-4">Loading categories...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <section className="section bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our wide range of product categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-4">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map(cat => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug || cat._id}`}
                className={`block p-4 rounded-lg shadow bg-white dark:bg-gray-900 hover:bg-primary-50 dark:hover:bg-primary-900 transition border border-gray-200 dark:border-gray-700 h-full`}
              >
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.description}</p>
              </Link>
            ))
          ) : (
            <span className="text-gray-400">No categories found.</span>
          )}
        </div>
      </div>
    </section>
  )
}

export default Categories
