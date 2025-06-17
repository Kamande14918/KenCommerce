import React, { useEffect, useState } from 'react';
import { fetchSellers } from '../../api/sellers';
import './index.css'; // Importing styles for the component

const SellerList = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getSellers = async () => {
            try {
                const data = await fetchSellers();
                setSellers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getSellers();
    }, []);

    if (loading) {
        return <div className="loading">Loading sellers...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="seller-list">
            <h2>Seller List</h2>
            <ul>
                {sellers.map(seller => (
                    <li key={seller._id} className="seller-item">
                        <h3>{seller.storeName}</h3>
                        <p>Name: {seller.name}</p>
                        <p>Email: {seller.email}</p>
                        <a href={`/sellers/${seller._id}`} className="view-profile">View Profile</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SellerList;