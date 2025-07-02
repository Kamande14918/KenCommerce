import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setOrder(data);
      } catch (err) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) fetchOrder();
  }, [orderId, userInfo]);

  if (loading) return <div className="text-center py-10">Loading order...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="mb-2"><span className="font-semibold">Order #:</span> {order._id}</div>
        <div className="mb-2"><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
        <div className="mb-2"><span className="font-semibold">Status:</span> {order.status || order.orderStatus || 'Processing'}</div>
        <div className="mb-2"><span className="font-semibold">Total:</span> ${order.totalPrice?.toFixed(2)}</div>
        <div className="mb-2"><span className="font-semibold">Shipping:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}</div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Items</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map(item => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b flex items-center gap-2">
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <span>{item.name}</span>
                </td>
                <td className="py-2 px-4 border-b">{item.qty}</td>
                <td className="py-2 px-4 border-b">${item.price?.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
