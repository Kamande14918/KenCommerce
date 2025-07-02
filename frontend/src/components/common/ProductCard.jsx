import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
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
);

export default ProductCard; 