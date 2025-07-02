import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <Link to="/admin" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Manage Products
          </Link>
          <Link to="/admin/products/create" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Add Product
          </Link>
          <Link to="/admin/orders" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Orders
          </Link>
          <Link to="/admin/users" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Users
          </Link>
          <Link to="/admin/categories" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Categories
          </Link>
          <Link to="/admin/reviews" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Reviews
          </Link>
          <Link to="/admin/settings" className="block px-6 py-3 text-gray-700 hover:bg-gray-50">
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
