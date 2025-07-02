import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user || user.role !== 'user') {
    return <Navigate to="/login" />;
  }
  return children;
};

export default UserRoute; 