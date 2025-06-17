import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                if (!data) {
                    setError('Product not found.');
                } else {
                    setProduct(data);
                }
            } catch (err) {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product details available.</p>;

    return (
        <div className="product-details-container">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
        </div>
    );
};

export default ProductDetails;