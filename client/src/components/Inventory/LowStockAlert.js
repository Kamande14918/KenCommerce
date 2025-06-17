import React, { useEffect, useState } from 'react';
import { getLowStockItems } from '../../api/products';
import './LowStockAlert.css';

const LowStockAlert = () => {
    const [lowStockItems, setLowStockItems] = useState([]);

    useEffect(() => {
        const fetchLowStockItems = async () => {
            try {
                const response = await getLowStockItems();
                setLowStockItems(response.data);
            } catch (error) {
                console.error('Error fetching low stock items:', error);
            }
        };

        fetchLowStockItems();
    }, []);

    return (
        <div className="low-stock-alert">
            <h2>Low Stock Alert</h2>
            {lowStockItems.length > 0 ? (
                <ul>
                    {lowStockItems.map(item => (
                        <li key={item._id}>
                            <span>{item.productId.name}</span> - 
                            <span> Stock: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No low stock items.</p>
            )}
        </div>
    );
};

export default LowStockAlert;