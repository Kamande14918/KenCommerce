import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const heroSlugs = ['home-garden', 'fashion', 'electronics'];
const heroImages = {
  'home-garden': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
  'fashion': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
  'electronics': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
};

const HeroCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories').then(res => {
      if (Array.isArray(res.data)) setCategories(res.data);
      else if (res.data && Array.isArray(res.data.categories)) setCategories(res.data.categories);
      else setCategories([]);
    });
  }, []);

  const heroCategories = categories.filter(cat => heroSlugs.includes(cat.slug));
  const otherCategories = categories.filter(cat => !heroSlugs.includes(cat.slug));

  return (
    <div className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {heroCategories.map(cat => (
          <Link
            key={cat._id}
            to={`/category/${cat._id}`}
            className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
          >
            <img
              src={heroImages[cat.slug] || heroImages['home-garden']}
              alt={cat.name}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <span className="text-white text-2xl font-bold drop-shadow">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {otherCategories.map(cat => (
          <Link
            key={cat._id}
            to={`/category/${cat._id}`}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-primary-600 hover:text-white transition"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HeroCategories; 