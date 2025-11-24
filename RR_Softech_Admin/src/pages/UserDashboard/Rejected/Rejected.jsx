import { useEffect, useState } from "react";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import Model from './../Services/Model';

export default function Rejected() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders();
        const rejected = data.filter((order) => order.status === "CANCELLED");
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
    return <p className="text-gray-600">Loading rejected orders...</p>;
  }

  return (
    <div className="relative bg-[#F5F5F5] min-h-screen">
      <h1 className="text-[#2563EB] text-2xl font-bold mb-1">
        Rejected Orders
      </h1>
      <p className="text-gray-600 mb-6">
        View and manage all your rejected RR Softech orders
      </p>

      {/* Rejected Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {orders.length > 0 ? (
          orders.map((order) => (
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

      {/* Modal */}
      {selectedOrder && (
        <Model 
        selectedOrder={selectedOrder} 
        setSelectedOrder={setSelectedOrder}
        visibleTabs={ ["Chatting", "Reviews"]}
         />
      )}
    </div>
  );
}
