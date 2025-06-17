import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { checkPaymentStatus } from '../../api/payments';
import './index.css';

const PaymentStatus = () => {
    const { paymentId } = useParams();
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await checkPaymentStatus(paymentId);
                setPaymentStatus(response.data);
            } catch (err) {
                setError('Error fetching payment status');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [paymentId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="payment-status">
            <h2>Payment Status</h2>
            <p><strong>Order ID:</strong> {paymentStatus.orderId}</p>
            <p><strong>Amount:</strong> {paymentStatus.amount}</p>
            <p><strong>Payment Method:</strong> {paymentStatus.paymentMethod}</p>
            <p><strong>Status:</strong> {paymentStatus.status}</p>
            {paymentStatus.transactionId && (
                <p><strong>Transaction ID:</strong> {paymentStatus.transactionId}</p>
            )}
            {paymentStatus.refundId && (
                <p><strong>Refund ID:</strong> {paymentStatus.refundId}</p>
            )}
        </div>
    );
};

export default PaymentStatus;