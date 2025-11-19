import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/UserDashboard/useAuth";

export default function ProtectedRoute({ role, to }) {
  const { auth } = useAuth();

  // 1. Still loading user data → stop redirect
  // if (loading) return null;

  // 2. No login → go to login
  if (!auth?.access) {
    return <Navigate to={to} replace />;
  }

  if (role && auth?.role !== role) {
    return <Navigate to="/redirect-by-role" replace />;
  }

  return <Outlet />;
}
