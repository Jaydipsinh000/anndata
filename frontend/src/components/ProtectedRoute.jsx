import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfoStr = localStorage.getItem('userInfo');
  
  // If no user is logged in, redirect to login
  if (!userInfoStr) {
    return <Navigate to="/login" replace />;
  }

  const userInfo = JSON.parse(userInfoStr);

  // If allowedRoles is provided and user's role is not in the list, redirect to home
  if (allowedRoles && !allowedRoles.includes(userInfo.role) && userInfo.role !== 'admin' && userInfo.role !== 'superadmin') {
    return <Navigate to="/home" replace />;
  }

  // If authorized, render the children components
  return children;
};

export default ProtectedRoute;
