import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, increaseQuantity, decreaseQuantity } from '../../api/products';
import './ProductDetails.css'; // Assuming you have a CSS file for styling

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        getProductDetails();
    }, [id]);

    const handleIncrease = async () => {
        try {
            const res = await increaseQuantity(id, 1);
            setInventory(res.data);
        } catch {
            setError('Failed to increase quantity');
        }
    };

    const handleDecrease = async () => {
        try {
            const res = await decreaseQuantity(id, 1);
            setInventory(res.data);
        } catch {
            setError('Failed to decrease quantity');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-details">
            <div className="product-images">
                {product.images && product.images.map(img => (
                    <img key={img} src={`http://localhost:5000${img}`} alt={product.name} className="product-detail-image" />
                ))}
            </div>
            <div className="product-detail-info">
                <h1>{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-price">{`Price: $${product.price.toFixed(2)}`}</p>
                <p className="product-stock">{`Stock: ${product.stock}`}</p>
                <button className="add-to-cart-button">Add to Cart</button>
                {isOwner && (
                    <div className="inventory-controls">
                        <button className="btn" onClick={handleIncrease}>Increase Stock</button>
                        <button className="btn" onClick={handleDecrease}>Decrease Stock</button>
                        <p>Current Stock: {inventory ? inventory.quantity : 'N/A'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;