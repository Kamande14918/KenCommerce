import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you will create a CSS file for styling

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Navigation</h2>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/" className="sidebar-link">Home</Link>
                </li>
                <li>
                    <Link to="/products" className="sidebar-link">Products</Link>
                </li>
                <li>
                    <Link to="/sellers" className="sidebar-link">Sellers</Link>
                </li>
                <li>
                    <Link to="/cart" className="sidebar-link">Cart</Link>
                </li>
                <li>
                    <Link to="/checkout" className="sidebar-link">Checkout</Link>
                </li>
                <li>
                    <Link to="/payment" className="sidebar-link">Payment</Link>
                </li>
                <li>
                    <Link to="/login" className="sidebar-link">Login</Link>
                </li>
                <li>
                    <Link to="/register" className="sidebar-link">Register</Link>
                </li>
            </ul>
            <div className="products-layout">
                <aside className="sidebar">
                    <h3>Categories</h3>
                    <ul>
                        <li>Phones</li>
                        <li>Electronics</li>
                        <li>Fashion</li>
                        <li>Home</li>
                    </ul>
                </aside>
                <main className="main-content">
                    {/* ...products grid here... */}
                </main>
            </div>
        </div>
    );
};

export default Sidebar;