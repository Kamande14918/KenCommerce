import React, { useEffect, useState } from 'react';
import { getSellers } from '../api/sellers';
import SellerList from '../components/Sellers/SellerList';
import './Sellers.css'; // Assuming you have a CSS file for styling

const Sellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await getSellers();
                setSellers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);

    if (loading) {
        return <div className="loading">Loading sellers...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="sellers-page">
            <h1>Our Sellers</h1>
            <SellerList sellers={sellers} />
        </div>
    );
};

export default Sellers;