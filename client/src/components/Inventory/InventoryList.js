import React, { useEffect, useState } from 'react';
import { getAllInventoryItems } from '../../api/products'; // Adjust the import based on your API structure
import './InventoryList.css'; // Import your CSS file for styling

const InventoryList = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const items = await getAllInventoryItems();
                setInventoryItems(items);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryItems();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="inventory-list">
            <h2>Inventory List</h2>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Low Stock Threshold</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems.map(item => (
                        <tr key={item._id}>
                            <td>{item.productId.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.lowStockThreshold}</td>
                            <td>
                                <button className="btn-edit">Edit</button>
                                <button className="btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryList;