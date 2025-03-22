// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../store/auth";

// function ProtectedRoutes() {
//   let { isLoggedIn } = useAuth();
//   return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
// }

// export default ProtectedRoutes;

import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/Auth";

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}`} replace />; // Redirect to respective dashboard
  }

  return <Element />;
};

export default ProtectedRoute;
