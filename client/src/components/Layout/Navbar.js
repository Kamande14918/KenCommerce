import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">KenCommerce</Link>
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggle-icon"></span>
        </button>
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Shops</Link></li>
          {user && user.role === 'seller' && (
            <>
              <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/shop/create" onClick={() => setMenuOpen(false)}>Create Shop</Link></li>
              <li><Link to="/product/create" onClick={() => setMenuOpen(false)}>Add Product</Link></li>
              <li><Link to="/seller/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
            </>
          )}
          {!user || !user.email ? (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          ) : (
            <li><button className="btn-logout" onClick={handleLogout}>Logout</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;