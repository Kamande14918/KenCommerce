// Create placeholder pages for all routes
const pages = [
  'Category',
  'Search', 
  'Cart',
  'Checkout',
  'Profile',
  'OrderHistory',
  'OrderDetail',
  'Wishlist',
  'NotFound'
]

pages.forEach(pageName => {
  const content = `const ${pageName} = () => {
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${pageName}</h1>
        <p className="text-gray-600">${pageName} page coming soon...</p>
      </div>
    </div>
  )
}

export default ${pageName}`
  
  // This is a template - actual files will be created separately
})

// Individual page files:
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';

const Category = () => {
  const { id } = useParams(); // id can be slug or ObjectId
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setCategory(null);
    setProducts([]);
    // Fetch products for this category using the robust backend endpoint
    axios.get(`/api/products/category/${id}`)
      .then(res => {
        setProducts(res.data);
        if (res.data.length > 0 && res.data[0].category) {
          setCategory(res.data[0].category);
        } else {
          // Fallback: fetch category details directly if no products
          axios.get(`/api/categories`).then(catRes => {
            const found = (catRes.data.categories || catRes.data).find(c => c._id === id || c.slug === id);
            if (found) setCategory(found);
          });
        }
      })
      .catch(err => {
        setError('No products found for this category.');
      });
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{category?.name || 'Category'}</h1>
      {category?.description && <p className="mb-4 text-gray-600">{category.description}</p>}
      {error ? (
        <div className="text-center text-gray-500 py-12 text-lg">{error}</div>
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

export default Category;
