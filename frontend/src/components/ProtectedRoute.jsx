import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfoStr = localStorage.getItem('userInfo');
  
  // If no user is logged in, redirect to login
  if (!userInfoStr) {
    return <Navigate to="/login" replace />;
  }

  const userInfo = JSON.parse(userInfoStr);

  // Check Token Expiration
  try {
    const token = userInfo.token;
    if (token) {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('userInfo');
        toast.error('Session expired. Please login again.', { duration: 4000 });
        return <Navigate to="/login" replace />;
      }
    }
  } catch (e) {
    // If token is malformed, clear session
    console.error("Invalid token format:", e);
    localStorage.removeItem('userInfo');
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided and user's role is not in the list, redirect to home
  if (allowedRoles && !allowedRoles.includes(userInfo.role) && userInfo.role !== 'admin' && userInfo.role !== 'superadmin') {
    return <Navigate to="/home" replace />;
  }

  // If authorized, render the children components
  return children;
};

export default ProtectedRoute;
