import { useEffect, useState } from "react";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import { TAB_CONFIG } from "../../../utils/UserDashboard/services/tabconfig";
import { List, Grid3X3 } from "lucide-react";
import Model from "./Model";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
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
    return <p className="text-gray-600">Loading your orders...</p>;
  }

  return (
    <div className="relative bg-[#F5F5F5]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#2563EB] text-2xl font-bold mb-1">My Orders</h1>
          <p className="text-gray-600">
            Track and manage all your RR Softech orders in one place
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border transition ${viewMode === "grid"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300"
              }`}
          >
            <Grid3X3 size={18} />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border transition ${viewMode === "list"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300"
              }`}
          >
            <List size={18} />
          </button>
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




