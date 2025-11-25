import { useEffect, useState } from "react";
import OrderCard from "./../../../components/shared/userDashboard/OrderCard";
import Model from "./../Services/Model";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import ViewAllOrderBtn from "../../../components/shared/userDashboard/ViewAllOrderBtn";
import LoadingSpinner from "./../../../components/common/LoadingSpinner";
import Pagination from "../../../components/shared/userDashboard/Pagination";

export default function AwaitingPayment() {
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
        // Filter only finished orders (check backend naming: "FINISHED" vs "Finished")
        const AwaitingPayment = data.filter(
          (order) => order.status === "AWAITING_PAYMENT"
        );
        setOrders(AwaitingPayment);
      } catch (error) {
        console.error("Error fetching finished orders:", error);
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
        message="Loading Pending Orders List..."
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
                Awaiting Payment Orders
              </span>
            </h1>
            <p className="text-slate-600 text-sm">
              View and manage all your Awaiting Payment RR Softech orders
            </p>
          </div>
          <ViewAllOrderBtn />
        </div>
      </div>

      {/* Finished Order Cards */}
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
          <p className="text-gray-500 text-sm">
            No Awaiting Payment orders found.
          </p>
        )}
      </div>

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
          visibleTabs={["Chatting", "Transaction", "Milestone", "Reviews"]}
        />
      )}
    </div>
  );
}
