import React, { useEffect, useState } from "react";
import { stats } from "../../../api/admin/Stats";
import SearchBar from "../../../components/shared/admin/SearchBar";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import Pagination from "../../../components/shared/userDashboard/Pagination";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; 

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchOrders();
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setOrders(sorted);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  // Search logic
  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();
    const planDetails = order.plan_details?.toLowerCase() || "";
    const planPrice = order.plan_price ? order.plan_price.toString().toLowerCase() : "";
    const planData = order.created_at? order.created_at.toString().toLowerCase(): "";
    const planStatus = order.status? order.status.toString().toLowerCase(): "";


    return (
      planDetails.includes(text) ||
      planPrice.includes(text) ||
      planData.includes(text)  ||
      planStatus.includes(text)
    );
  });

  // Ensure filtered results also stay sorted
  const sortedFilteredOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = sortedFilteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(sortedFilteredOrders.length / pageSize);

  const handleViewDetails = (order) => {
    console.log("View details clicked:", order);
  };

  return (
    <div className="p-6">
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

        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); 
          }}
          placeholder="status,price,name"
          size="sm"
          className="relative w-full md:w-64 rounded-xl bg-white"
          iconColor="text-gray-400"
          borderColor="border-gray-400"
          focusColor="focus:ring-blue-500"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 gap-4 mb-10">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-xl font-semibold text-gray-800">
                {item.value}
              </h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              {item.icon &&
                React.createElement(item.icon, {
                  className: "text-blue-600",
                  size: 24,
                })}
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recent Service Requests
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading orders...</p>
      ) : sortedFilteredOrders.length === 0 ? (
        <p className="text-gray-500 py-6 text-center">
          No matching orders found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => handleViewDetails(order)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
