import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../common/ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products/featured?limit=8&sort=newest').then(res => setProducts(res.data));
  }, []);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Featured Products</h2>
        <Link to="/products?featured=true" className="text-primary-600 hover:underline text-sm font-medium">View All</Link>
      </div>
      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-x-visible">
        {products.map(product => (
          <div key={product._id} className="min-w-[250px] max-w-xs w-full md:min-w-0 md:max-w-none flex-shrink-0 md:flex-shrink md:col-span-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

const NewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products?sort=newest&limit=8').then(res => setProducts(res.data));
  }, []);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">New Products</h2>
        <Link to="/products?sort=newest" className="text-primary-600 hover:underline text-sm font-medium">View All</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-x-visible">
        {products.map(product => (
          <div key={product._id} className="min-w-[250px] max-w-xs w-full md:min-w-0 md:max-w-none flex-shrink-0 md:flex-shrink md:col-span-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export { FeaturedProducts, NewProducts };
export default FeaturedProducts;
