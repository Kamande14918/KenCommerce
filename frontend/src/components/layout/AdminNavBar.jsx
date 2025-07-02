import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from 'react-icons/hi';

const AdminNavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/reviews', label: 'Reviews' },
    { to: '/admin/settings', label: 'Settings' },
    { to: '/logout', label: 'Logout' },
  ];
  return (
    <nav className="bg-gray-900 text-white px-4 py-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/admin/dashboard" className="font-bold text-xl">Admin Panel</Link>
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="hover:text-primary-400">{link.label}</Link>
          ))}
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
          <HiMenu className="w-7 h-7" />
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => setMobileOpen(false)}>
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-lg p-6 flex flex-col gap-6 z-50" onClick={e => e.stopPropagation()}>
            <button className="self-end mb-4" onClick={() => setMobileOpen(false)}>
              <HiX className="w-7 h-7" />
            </button>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="py-2 text-lg hover:text-primary-400" onClick={() => setMobileOpen(false)}>{link.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavBar; 