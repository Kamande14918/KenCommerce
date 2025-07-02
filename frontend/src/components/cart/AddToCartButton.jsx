import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const AddToCartButton = ({ product, qty = 1, disabled }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Added to cart!', { position: 'top-right' });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || product.inventory?.stock <= 0}
      className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition disabled:opacity-50"
    >
      {product.inventory?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
};

export default AddToCartButton; 