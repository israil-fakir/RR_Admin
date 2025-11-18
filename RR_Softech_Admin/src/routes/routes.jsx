import { createBrowserRouter } from "react-router-dom";
import ChangePassword from "../components/common/ChangePassword";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import AdminLayout from "../components/layout/admin/AdminLayout";
import DashboardLayout from "../components/layout/userDashboard/DashboardLayout";
import AuthModal from "../components/shared/userDashboard/auth/AuthModal";
import AdminRoleSelector from "../pages/admin/AdminRoleSelector/AdminRoleSelector";
import Analytics from "../pages/admin/Analytics/Analytics";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import Feedback from "../pages/admin/Feedback/Feedback";
import Messages from "../pages/admin/Messages/Messages";
import Services from "../pages/admin/Services/Services";
import Settings from "../pages/admin/Settings/Settings";
import Transactions from "../pages/admin/Transactions/Transactions";
import UsersManagement from "../pages/admin/UsersManage/UsersManagement";
import OrdersList from "../pages/UserDashboard/Services/OrdersList";
import NotFound from "./../components/common/NotFound";
import Accepted from "./../pages/UserDashboard/Accepted/Accepted";
import Finished from "./../pages/UserDashboard/Finished/Finished";
import FreeConsultancy from "./../pages/UserDashboard/FreeConsultancy/FreeConsultancy";
import Pending from "./../pages/UserDashboard/Pending/Pending";
import Rejected from "./../pages/UserDashboard/Rejected/Rejected";
import ApprovalPending from "../pages/admin/ApprovalPending/ApprovalPending";
import AwaitingPayment from "../pages/UserDashboard/AwaitingPayment/AwaitingPayment";
import AllServices from "../pages/UserDashboard/AlllServices/AllServices";

const router = createBrowserRouter([
  {
    element: <PublicRoute to="/user/orders" />,
    children: [{ path: "user/login", element: <AuthModal role="CUSTOMER" /> }],
  },

  {
    element: <ProtectedRoute to="/user/login" />,
    children: [
      {
        path: "user",
        element: <DashboardLayout />,
        children: [
          { path: "orders", element: <OrdersList /> },
          { path: "pending", element: <Pending /> },
          { path: "awaiting-payment", element: <AwaitingPayment /> },
          { path: "accepted", element: <Accepted /> },
          { path: "rejected", element: <Rejected /> },
          { path: "finished", element: <Finished /> },
          { path: "services", element: <AllServices /> },
          { path: "free-consultancy", element: <FreeConsultancy /> },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminRoleSelector />,
  },

  {
    element: <PublicRoute to="/admin/dashboard" />,
    children: [
      { path: "admin/login", element: <AuthModal role="OWNER" /> },
      { path: "employee/login", element: <AuthModal role="EMPLOYEE" /> },
      { path: "employee/login/pending", element: <ApprovalPending /> },
    ],
  },

  {
    element: <ProtectedRoute to="/admindashboard" />,
    children: [
      {
        path: "/admindashboard",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "users-manage", element: <UsersManagement /> },
          { path: "services", element: <Services /> },
          { path: "transactions", element: <Transactions /> },
          { path: "analytics", element: <Analytics /> },
          { path: "messages", element: <Messages /> },
          { path: "feedback", element: <Feedback /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute to="/employeedashboard" />,
    children: [
      {
        path: "/employeedashboard",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "services", element: <Services /> },
          { path: "transactions", element: <Transactions /> },
          { path: "analytics", element: <Analytics /> },
          { path: "messages", element: <Messages /> },
          { path: "feedback", element: <Feedback /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
