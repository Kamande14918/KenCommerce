import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    try {
      // Simulate payment API call
      if (!amount || isNaN(amount)) {
        setError('Please enter a valid amount.');
        return;
      }
      setStatus('Payment successful!');
      setTimeout(() => {
        navigate('/'); // Redirect to home or any other page
      }, 1500);
    } catch (err) {
      setError('Payment failed. Try again.');
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Make a Payment</h2>
      <div>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit">Pay</button>
      {status && <p className="success">{status}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default PaymentForm;