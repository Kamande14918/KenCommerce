import { Link } from "react-router-dom";

const AdminNavBar = () => (
  <nav className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
    <div>
      <Link to="/admin/dashboard" className="font-bold text-xl">Admin Panel</Link>
    </div>
    <div className="flex gap-4 items-center">
      <Link to="/admin/products">Products</Link>
      <Link to="/admin/orders">Orders</Link>
      <Link to="/admin/users">Users</Link>
      <Link to="/admin/categories">Categories</Link>
      <Link to="/admin/reviews">Reviews</Link>
      <Link to="/admin/settings">Settings</Link>
      <Link to="/logout">Logout</Link>
    </div>
  </nav>
);

export default AdminNavBar; 