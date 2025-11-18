import { useEffect, useState } from "react";
import OrderCard from './../../../components/shared/userDashboard/OrderCard';
import Model from './../Services/Model';
import { fetchOrders } from "../../../api/UserDashboard/orders";

export default function AwaitingPayment() {
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
        // Filter only finished orders (check backend naming: "FINISHED" vs "Finished")
        const AwaitingPayment = data.filter((order) => order.status === "AWAITING_PAYMENT");
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
    return <p className="text-gray-600">Loading Awaiting Payment orders...</p>;
  }

  return (
    <div className="relative bg-[#F5F5F5] min-h-screen">
      <h1 className="text-[#2563EB] text-2xl font-bold mb-1">Awaiting Payment Orders</h1>
      <p className="text-gray-600 mb-6">
        View and manage all your Awaiting Payment RR Softech orders
      </p>

      {/* Finished Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => handleViewDetails(order)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No Awaiting Payment orders found.</p>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <Model 
        selectedOrder={selectedOrder} 
        setSelectedOrder={setSelectedOrder}
        visibleTabs={["Chatting", "Transaction",'Milestone','Payment', "Reviews"]}
         />
      )}
    </div>
  );
}
