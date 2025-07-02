import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserNavBar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <div>
        <Link to="/" className="font-bold text-xl">KenCommerce</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        {userInfo ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/logout">Logout</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default UserNavBar; 