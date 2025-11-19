import { Navigate } from "react-router-dom";
import useAuth from "../../../../hooks/UserDashboard/useAuth";


export default function RoleRedirect() {
  const { auth } = useAuth();

  // if (loading) return null;

  if (!auth?.access) return <Navigate to="/login" />;

  const role = auth.role;

  if (role === "OWNER") return <Navigate to="/admin" />;
  if (role === "EMPLOYEE") return <Navigate to="/employee" />;

  return <Navigate to="/customer" />;
}
