import React, { useState } from 'react';
import axios from 'axios';
import './RefundForm.css'; // Assuming you will create a CSS file for styling

const RefundForm = () => {
    const [orderId, setOrderId] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRefundRequest = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('/api/payments/refund', {
                orderId,
                transactionId,
            });

            if (response.data.success) {
                setMessage('Refund request submitted successfully.');
            } else {
                setError('Failed to submit refund request. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while processing your request.');
        }
    };

    return (
        <div className="refund-form-container">
            <h2>Request a Refund</h2>
            <form onSubmit={handleRefundRequest}>
                <div className="form-group">
                    <label htmlFor="orderId">Order ID:</label>
                    <input
                        type="text"
                        id="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="transactionId">Transaction ID:</label>
                    <input
                        type="text"
                        id="transactionId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Refund Request</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default RefundForm;