import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const paymentMethods = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'stripe', label: 'Credit/Debit Card (Stripe)' },
  { value: 'paypal', label: 'PayPal' }
];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', address: '', city: '', state: '', postalCode: '', country: '', phone: ''
  });
  const [payment, setPayment] = useState('mpesa');
  const [paymentDetails, setPaymentDetails] = useState({ mpesa: '', stripe: { cardNumber: '', exp: '', cvc: '' }, paypal: '' });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  // Step 1: Shipping Address
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Step 2: Payment Method
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // Step 3: Review & Place Order
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('kencommerce_token');
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0]?.url || ''
      }));
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingPrice = 0; // or calculate based on method
      const taxPrice = 0; // or calculate if needed
      const totalPrice = subtotal + shippingPrice + taxPrice;

      // Collect payment details
      let paymentPayload = { method: payment };
      if (payment === 'mpesa') {
        paymentPayload.mpesaNumber = paymentDetails.mpesa;
      } else if (payment === 'stripe') {
        paymentPayload.stripe = paymentDetails.stripe;
      } else if (payment === 'paypal') {
        paymentPayload.paypalEmail = paymentDetails.paypal;
      }

      const { data } = await axios.post('/api/orders', {
        orderItems,
        shippingAddress: shipping,
        paymentMethod: payment,
        paymentDetails: paymentPayload,
        shippingPrice,
        taxPrice,
        totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderId(data.data._id);
      setStep(4);
      // Optionally: clear cart here
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (!cartItems || !cartItems.length) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-500">Your cart is empty. Please add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {step === 1 && (
        <form onSubmit={handleShippingSubmit} className="space-y-4">
          <h2 className="font-semibold">Shipping Address</h2>
          <input required name="firstName" placeholder="First Name" value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} className="input" />
          <input required name="lastName" placeholder="Last Name" value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} className="input" />
          <input required name="address" placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} className="input" />
          <input required name="city" placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} className="input" />
          <input required name="state" placeholder="State" value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} className="input" />
          <input required name="postalCode" placeholder="Postal Code" value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} className="input" />
          <input required name="country" placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} className="input" />
          <input required name="phone" placeholder="Phone" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} className="input" />
          <button type="submit" className="btn-primary w-full">Continue to Payment</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <h2 className="font-semibold">Payment Method</h2>
          {paymentMethods.map(pm => (
            <label key={pm.value} className="block">
              <input type="radio" name="payment" value={pm.value} checked={payment === pm.value} onChange={e => setPayment(e.target.value)} />
              {pm.label}
            </label>
          ))}
          {/* Payment details fields */}
          {payment === 'mpesa' && (
            <input required placeholder="M-Pesa Phone Number" value={paymentDetails.mpesa} onChange={e => setPaymentDetails({ ...paymentDetails, mpesa: e.target.value })} className="input" />
          )}
          {payment === 'stripe' && (
            <div className="space-y-2">
              <input required placeholder="Card Number" value={paymentDetails.stripe.cardNumber} onChange={e => setPaymentDetails({ ...paymentDetails, stripe: { ...paymentDetails.stripe, cardNumber: e.target.value } })} className="input" />
              <input required placeholder="Expiry (MM/YY)" value={paymentDetails.stripe.exp} onChange={e => setPaymentDetails({ ...paymentDetails, stripe: { ...paymentDetails.stripe, exp: e.target.value } })} className="input" />
              <input required placeholder="CVC" value={paymentDetails.stripe.cvc} onChange={e => setPaymentDetails({ ...paymentDetails, stripe: { ...paymentDetails.stripe, cvc: e.target.value } })} className="input" />
            </div>
          )}
          {payment === 'paypal' && (
            <input required placeholder="PayPal Email" value={paymentDetails.paypal} onChange={e => setPaymentDetails({ ...paymentDetails, paypal: e.target.value })} className="input" />
          )}
          <div className="flex gap-2">
            <button type="button" className="btn-outline" onClick={() => setStep(1)}>Back</button>
            <button type="submit" className="btn-primary">Review Order</button>
          </div>
        </form>
      )}
      {step === 3 && (
        <div>
          <h2 className="font-semibold mb-2">Review Order</h2>
          <div className="mb-4">
            <h3 className="font-bold">Shipping Address</h3>
            <div>{shipping.firstName} {shipping.lastName}, {shipping.address}, {shipping.city}, {shipping.state}, {shipping.postalCode}, {shipping.country}, {shipping.phone}</div>
          </div>
          <div className="mb-4">
            <h3 className="font-bold">Payment Method</h3>
            <div>{paymentMethods.find(pm => pm.value === payment)?.label}</div>
            {payment === 'mpesa' && <div>M-Pesa Number: {paymentDetails.mpesa}</div>}
            {payment === 'stripe' && <div>Card: **** **** **** {paymentDetails.stripe.cardNumber.slice(-4)}</div>}
            {payment === 'paypal' && <div>PayPal: {paymentDetails.paypal}</div>}
          </div>
          <div className="mb-4">
            <h3 className="font-bold">Items</h3>
            <ul>
              {cartItems.map(item => (
                <li key={item._id}>{item.name} x {item.quantity} = Ksh {item.price * item.quantity}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <strong>Total: Ksh {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</strong>
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => setStep(2)}>Back</button>
            <button className="btn-primary" onClick={handlePlaceOrder} disabled={loading}>{loading ? 'Placing Order...' : 'Place Order'}</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p>Your order has been placed successfully.</p>
          <button className="btn-primary mt-4" onClick={() => navigate(`/order/${orderId}`)}>View Order Details</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
