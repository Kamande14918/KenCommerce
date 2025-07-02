import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { HiOutlineShoppingBag, HiMenu, HiX } from 'react-icons/hi';

const UserNavBar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector(state => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/cart', label: 'Cart', icon: <HiOutlineShoppingBag className="w-5 h-5 inline-block mb-0.5" /> },
  ];

  return (
    <nav className="bg-white shadow px-4 py-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-primary-600">KenCommerce</Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="relative hover:text-primary-600 flex items-center">
              {link.icon}
              <span className="ml-1">{link.label}</span>
              {link.label === 'Cart' && cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">{cartCount}</span>
              )}
            </Link>
          ))}
          {userInfo ? (
            <>
              <Link to="/profile" className="hover:text-primary-600">Profile</Link>
              <Link to="/logout" className="hover:text-primary-600">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary-600">Login</Link>
              <Link to="/register" className="hover:text-primary-600">Register</Link>
            </>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
          <HiMenu className="w-7 h-7" />
        </button>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => setMobileOpen(false)}>
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col gap-6 z-50" onClick={e => e.stopPropagation()}>
            <button className="self-end mb-4" onClick={() => setMobileOpen(false)}>
              <HiX className="w-7 h-7" />
            </button>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="relative flex items-center gap-2 py-2 text-lg hover:text-primary-600" onClick={() => setMobileOpen(false)}>
                {link.icon}
                <span>{link.label}</span>
                {link.label === 'Cart' && cartCount > 0 && (
                  <span className="absolute left-16 bg-red-500 text-white text-xs rounded-full px-1.5">{cartCount}</span>
                )}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              {userInfo ? (
                <>
                  <Link to="/profile" className="hover:text-primary-600" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <Link to="/logout" className="hover:text-primary-600" onClick={() => setMobileOpen(false)}>Logout</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-primary-600" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="hover:text-primary-600" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavBar; 