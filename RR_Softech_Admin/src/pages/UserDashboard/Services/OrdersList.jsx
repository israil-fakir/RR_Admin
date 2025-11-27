import { useEffect, useState } from "react";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import { TAB_CONFIG } from "../../../utils/UserDashboard/services/tabconfig";
import { List, Grid3X3 } from "lucide-react";
import Model from "./Model";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;
  const visibleTabs = selectedOrder
    ? TAB_CONFIG[selectedOrder.status] || []
    : [];
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = orders.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading Orders List..."
      />
    );
  }

  return (
    <div className="relative bg-gray-50 h-full p-8 border border-gray-200  rounded-xl">
      <div className="bg-white rounded-2xl shadow-x border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title Section */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                My All Orders
              </span>
            </h1>
            <p className="text-slate-600 text-sm">
              Track and manage all your RR Softech orders in one place
            </p>
          </div>

          {/* View Toggle - Enhanced */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200 shadow-sm cursor-pointer">
            <button
              onClick={() => setViewMode("grid")}
              className={`group relative px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid3X3
                size={18}
                strokeWidth={2.5}
                className={`transition-transform duration-300 ${
                  viewMode === "grid" ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span className="hidden sm:inline font-semibold">Grid View</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`group relative px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List
                size={18}
                strokeWidth={2.5}
                className={`transition-transform duration-300 cursor-pointer ${
                  viewMode === "list" ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span className="hidden sm:inline font-semibold cursor-pointer">
                List View
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
            : "flex flex-col gap-4"
        }
      >
        {currentItems.length > 0 ? (
          currentItems.map((order) => (
            <div key={order.id} className={viewMode === "list" ? "w-full" : ""}>
              <OrderCard
                order={order}
                viewMode={viewMode}
                onViewDetails={() => handleViewDetails(order)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No orders found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}

      {/* Modal */}
      {selectedOrder && (
        <Model
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          visibleTabs={visibleTabs}
        />
      )}
    </div>
  );
}
