import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${slug}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    const variant = undefined; // Update this if you support variants
    const cartItemId = product._id + (variant ? '-' + variant.name + '-' + variant.value : '');
    dispatch(addToCart({
      ...product,
      image: product.image || product.primaryImage?.url || product.images?.[0]?.url || '/logo.svg',
      quantity: 1,
      variant,
      cartItemId,
    }));
  };

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 w-full">
          <img src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} className="w-full h-80 object-cover rounded mb-4" />
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img key={idx} src={img.url} alt={product.name} className="w-16 h-16 object-cover rounded border" />
              ))}
            </div>
          )}
        </div>
        <div className="md:w-1/2 w-full">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl text-primary-600 font-semibold mb-2">${product.price}</div>
          <div className="mb-2 text-gray-600">{product.description}</div>
          <div className="mb-2">
            <span className={`text-sm ${product.inventory?.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.inventory?.stock > 0 ? `In Stock: ${product.inventory.stock}` : 'Out of Stock'}</span>
          </div>
          <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50 w-full md:w-auto" disabled={product.inventory?.stock <= 0} onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
