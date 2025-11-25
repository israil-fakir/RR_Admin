import { useEffect, useState } from "react";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import Model from "../Services/Model";
import ViewAllOrderBtn from "../../../components/shared/userDashboard/ViewAllOrderBtn";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function Rejected() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;
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
        const rejected = data.filter(
          (order) => order.status === "CANCELLED"
        );
        setOrders(rejected);
      } catch (error) {
        console.error("Error fetching rejected orders:", error);
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
        message="Loading Rejected Orders List..."
      />
    );
  }

  return (
    <div className="relative h-full p-8 border border-gray-200 rounded-xl">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-x border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5 flex items-center gap-3">
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Cencelled Orders
              </span>
            </h1>
            <p className="text-slate-600 text-sm">
              View and manage all your rejected RR Softech orders
            </p>
          </div>

          <ViewAllOrderBtn />
        </div>
      </div>

      {/* ORDER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {currentItems.length > 0 ? (
          currentItems.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => handleViewDetails(order)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No rejected orders found.</p>
        )}
      </div>

      {/* PAGINATION */}
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

      {/* MODAL */}
      {selectedOrder && (
        <Model
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          visibleTabs={["Chatting", "Reviews"]}
        />
      )}
    </div>
  );
}
