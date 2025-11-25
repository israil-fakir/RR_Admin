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
import RoleRedirect from "../components/shared/userDashboard/auth/RoleRedirect";
import EmployeeMassage from "../pages/employee/Massage/EmployeeMassage";
import PaymentSuccess from "../pages/UserDashboard/PaymentSuccess/PaymentSuccess";
import ConsultancyRequest from "../pages/employee/ConsultancyRequest/ConsultancyRequest";
import ConsultancyRequestAdmin from "../pages/admin/ConsultancyRequestAdmin/ConsultancyRequestAdmin";
import VerifyingTransction from "../components/shared/admin/VerifyingTransction";
import TransactionDetails from "../pages/admin/Transactions/TransactionDetails";
import UserDetailsPage from "../pages/admin/UsersManage/UserDetailsPage";

const router = createBrowserRouter([
  // ============================
  // PUBLIC ROUTE
  // ============================
  {
    element: <PublicRoute to="/redirect-by-role" />,
    children: [
      {
        path: "/",
        element: <AuthModal />,
      },
    ],
  },

  {
    path: "/redirect-by-role",
    element: <RoleRedirect />,
  },

  // ============================
  // CUSTOMER ROUTES
  // ============================
  {
    element: <ProtectedRoute role="CUSTOMER" to="/" />,
    children: [
      {
        path: "/customer",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OrdersList /> },
          { path: "orders", element: <OrdersList /> },
          { path: "pending", element: <Pending /> },
          { path: "awaiting-payment", element: <AwaitingPayment /> },
          { path: "accepted", element: <Accepted /> },
          { path: "rejected", element: <Rejected /> },
          { path: "finished", element: <Finished /> },
          { path: "services", element: <AllServices /> },
          { path: "free-consultancy", element: <FreeConsultancy /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "payment-success", element: <PaymentSuccess /> },
        ],
      },
    ],
  },

  // ============================
  // EMPLOYEE ROUTES
  // ============================
  {
    element: <ProtectedRoute role="EMPLOYEE" to="/" />,
    children: [
      {
        path: "/employee",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "services", element: <Services /> },
          { path: "transactions", element: <Transactions /> },
          { path: "transactions/:id/", element: <TransactionDetails /> },
          { path: "transactions-verify", element: <VerifyingTransction /> },
          { path: "messages", element: <EmployeeMassage /> },
          { path: "feedback", element: <Feedback /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "consultancy-services", element: <ConsultancyRequest /> },
        ],
      },
    ],
  },

  // ============================
  // ADMIN ROUTES
  // ============================
  {
    element: <ProtectedRoute role="OWNER" to="/" />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "users-manage", element: <UsersManagement /> },
          { path: "users-manage/:id/", element: <UserDetailsPage /> },
          { path: "services", element: <Services /> },
          { path: "transactions", element: <Transactions /> },
          { path: "transactions/:id/", element: <TransactionDetails /> },
          { path: "transactions-verify", element: <VerifyingTransction /> },
          { path: "messages", element: <Messages /> },
          {
            path: "consultancy-services",
            element: <ConsultancyRequestAdmin />,
          },
          { path: "feedback", element: <Feedback /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },

  // ============================
  // 404 FALLBACK
  // ============================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
