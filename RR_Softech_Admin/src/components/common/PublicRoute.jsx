import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/UserDashboard/useAuth";

export default function PublicRoute({ to }) {
  const { auth } = useAuth();

 // if (loading) return null; // prevent flicker

  // If logged in → go to role redirect
  if (auth?.access) {
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
