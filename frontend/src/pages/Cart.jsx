import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQty, clearCart } from '../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const ids = cartItems.map(item => item._id);
      const productData = {};
      await Promise.all(ids.map(async id => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          productData[id] = data;
        } catch (e) {
          productData[id] = null;
        }
      }));
      setProducts(productData);
    };
    if (cartItems.length > 0) fetchProducts();
  }, [cartItems]);

  const handleQtyChange = (cartItemId, quantity) => {
    dispatch(updateCartQty({ cartItemId, quantity: Number(quantity) }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {cartItems.map(item => {
            const product = products[item._id];
            return (
              <div
                key={item.cartItemId}
                className="flex flex-col sm:flex-row items-center bg-white rounded shadow p-4 gap-4"
              >
                <img src={product?.images?.[0]?.url || '/logo.svg'} alt={product?.name || item.name} className="w-24 h-24 object-cover rounded mb-4 sm:mb-0" />
                <div className="flex-1 w-full">
                  <Link to={`/products/${product?.slug || item.slug || item.productId}`} className="font-semibold text-lg hover:underline">{product?.name || item.name}</Link>
                  <div className="text-primary-600 font-bold">${item.price}</div>
                  <div>
                    <label className="mr-2">Qty:</label>
                    <select
                      value={item.quantity ?? 1}
                      onChange={e => handleQtyChange(item.cartItemId, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {[...Array(item.maxQuantity || 10).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.cartItemId)}
                  className="text-red-600 hover:underline mt-2 sm:mt-0"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            <button
              onClick={handleCheckout}
              className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 w-full md:w-auto"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
