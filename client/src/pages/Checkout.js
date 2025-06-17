import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/Payments/PaymentForm';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const navigate = useNavigate();

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCheckout = () => {
        clearCart();
        navigate('/payment');
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.id}>
                                    {item.name} - ${item.price} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                        <h3>Total Amount: ${totalAmount}</h3>
                    </div>
                    <div className="payment-method">
                        <h2>Select Payment Method</h2>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="stripe"
                                    checked={paymentMethod === 'stripe'}
                                    onChange={handlePaymentMethodChange}
                                />
                                Stripe
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={handlePaymentMethodChange}
                                />
                                PayPal
                            </label>
                        </div>
                    </div>
                    <PaymentForm paymentMethod={paymentMethod} onCheckout={handleCheckout} />
                </>
            )}
        </div>
    );
};

export default Checkout;