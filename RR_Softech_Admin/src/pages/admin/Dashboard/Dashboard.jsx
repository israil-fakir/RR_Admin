import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/shared/admin/SearchBar";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import useAuth from "../../../hooks/UserDashboard/useAuth";
import DashboardAnalytices from "../DashboardAnalytices/DashboardAnalytices";
import EmployeeAnalytices from "../../employee/employeeAnalytices/employeeAnalytices";
import { showDashboardAnalytics } from "../../../api/admin/dashboardAnalytics";
import AdminModel from "../../../components/shared/admin/AdminModel";
import { TAB_CONFIG_ADMIN } from "../../../utils/admin/TAB_CONFIG_ADMIN";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // NEW STATE
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [analytics, setAnalytics] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const visibleTabs = selectedOrder
    ? TAB_CONFIG_ADMIN[selectedOrder.status] || []
    : [];

  const pageSize = 8;
  const { auth } = useAuth();

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchOrders();

        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sorted);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadAnalytics() {
      try {
        setAnalyticsLoading(true);
        const data = await showDashboardAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setAnalyticsLoading(false);
      }
    }

    loadOrders();
    loadAnalytics();
  }, []);

  // Extract all unique statuses
  const statusOptions = [...new Set(orders.map((o) => o.status))];

  // FILTER + SEARCH
  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();
    const matchesSearch =
      order.plan_details?.toLowerCase().includes(text) ||
      order.plan_price?.toString().toLowerCase().includes(text) ||
      order.created_at?.toString().toLowerCase().includes(text) ||
      order.status?.toLowerCase().includes(text);

    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedFilteredOrders = filteredOrders.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = sortedFilteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(sortedFilteredOrders.length / pageSize);

  const handleViewDetails = (order) => setSelectedOrder(order);

    if (loading) {
      return (
        <LoadingSpinner
          variant="fullscreen"
          size="lg"
          message="Loading Dashboard..."
        />
      );
    }

  return (
    <div className="relative bg-gray-50 h-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 border border-gray-200 rounded-xl overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor all activities and performance metrics in one place.
          </p>
        </div>

        {/* SEARCH + FILTER DROPDOWN */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <SearchBar
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="status, price, name"
            size="sm"
            className="relative w-full md:w-64 rounded-xl bg-white"
            iconColor="text-gray-400"
            borderColor="border-gray-400"
            focusColor="focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ANALYTICS */}
      {auth.role === "OWNER" ? (
        <DashboardAnalytices analytics={analytics} loading={analyticsLoading} />
      ) : (
        <EmployeeAnalytices />
      )}

      {/* ORDERS SECTION */}

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Recent Service Requests
        </h2>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-40 px-3 py-2 border rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading orders...</p>
      ) : sortedFilteredOrders.length === 0 ? (
        <p className="text-gray-500 py-6 text-center">
          No matching orders found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 mdx:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => handleViewDetails(order)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* MODEL */}
      {selectedOrder && (
        <AdminModel
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          visibleTabs={visibleTabs}
        />
      )}
    </div>
  );
}
