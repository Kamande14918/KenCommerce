import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerById } from '../api/sellers';
import './SellerProfile.css';

const SellerProfile = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const data = await getSellerById(id);
                setSeller(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="seller-profile">
            <h1>{seller.storeName}</h1>
            <p><strong>Name:</strong> {seller.name}</p>
            <p><strong>Email:</strong> {seller.email}</p>
            <h2>Products</h2>
            <ul>
                {seller.products.map(product => (
                    <li key={product._id}>{product.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SellerProfile;