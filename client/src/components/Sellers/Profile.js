import React, { useEffect, useState } from 'react';
import { listShopsByOwner } from '../../api/shops';
import { fetchProducts } from '../../api/products';
import { useParams } from 'react-router-dom';
import { fetchSellerById } from '../../api/sellers';
import './SellerProfile.css';

const SellerProfile = ({ token, user }) => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const data = await fetchSellerById(id);
                setSeller(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [id]);

    useEffect(() => {
        listShopsByOwner(token)
            .then(res => setShops(res.data))
            .catch(() => setShops([]));
        fetchProducts()
            .then(res => setProducts(res))
            .catch(() => setProducts([]));
    }, [token]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="seller-profile">
            <h1>{seller.storeName}</h1>
            <p><strong>Name:</strong> {seller.name}</p>
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Products:</strong> {seller.products.length}</p>
            <p><strong>Joined:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
            <h2>Products</h2>
            <ul>
                {seller.products.map(product => (
                    <li key={product._id}>{product.name}</li>
                ))}
            </ul>
            <h3>Your Shops</h3>
            <ul>
                {shops.map(shop => (
                    <li key={shop._id}>{shop.name}</li>
                ))}
            </ul>
            <h3>Your Products</h3>
            <ul>
                {products.filter(p => shops.some(s => s._id === p.shop)).map(product => (
                    <li key={product._id}>{product.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SellerProfile;