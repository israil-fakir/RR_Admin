import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/shared/admin/SearchBar";
import { fetchOrders } from "../../../api/UserDashboard/orders";
import OrderCard from "../../../components/shared/userDashboard/OrderCard";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import AdminModel from "../../../components/shared/admin/AdminModel";
import { TAB_CONFIG_ADMIN } from "../../../utils/admin/TAB_CONFIG_ADMIN";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const visibleTabs = selectedOrder
    ? TAB_CONFIG_ADMIN[selectedOrder.status] || []
    : [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Orders
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Filtering + Search
  useEffect(() => {
    let updated = [...orders];

    // 1️⃣ Status Filter (case-insensitive)
    if (activeFilter !== "All") {
      updated = updated.filter(
        (item) =>
          String(item.status || "").toLowerCase() ===
          activeFilter.toLowerCase()
      );
    }

    // 2️⃣ Global Search
    if (search.trim() !== "") {
      const keyword = search.toLowerCase();

      updated = updated.filter((item) => {
        const title = String(item.plan_details || "").toLowerCase();
        const desc = String(item.description || "").toLowerCase();
        const stat = String(item.status || "").toLowerCase();
        const price = String(item.plan_price || "").toLowerCase();

        return (
          title.includes(keyword) ||
          desc.includes(keyword) ||
          stat.includes(keyword) ||
          price.includes(keyword)
        );
      });
    }

    setFilteredOrders(updated);
    setCurrentPage(1);
  }, [activeFilter, search, orders]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Modal open
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="p-6 w-full bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
        <p className="text-gray-500 text-sm">
          Manage and track all user orders and service purchases.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        type="text"
        value={search}
        placeholder="Search by plan, description, price or status..."
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {/* Status Filter */}
      <div className="pb-8 flex flex-row items-center gap-2 md:gap-3 overflow-x-auto whitespace-nowrap">
        {["All", "PENDING", "ACTIVE", "CANCELLED", "PAID"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`md:px-4 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === filter
                ? "bg-gray-300 text-black shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading orders...</p>
      ) : currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {currentItems.map((order) => (
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
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No matching orders found.
        </p>
      )}

      {/* MODAL (FIXED) */}
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
