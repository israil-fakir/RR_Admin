import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/shared/admin/SearchBar";
import { fetchTransactionsall } from "../../../api/UserDashboard/transaction";
import Pagination from "../../../components/shared/userDashboard/Pagination";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Status Colors
  const statusColor = {
    SUCCESS: "bg-green-600 text-white",
    FAILED: "bg-red-600 text-white",
    PENDING: "bg-yellow-600 text-white",
  };

  // Load Data
  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await fetchTransactionsall();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  // Search Logic (search all fields)
  const filteredData = transactions.filter((item) => {
    const s = search.toLowerCase();
    const dateString = new Date(item.timestamp).toLocaleString().toLowerCase();

    return (
      item.id.toString().includes(s) ||
      item.order_id.toString().includes(s) ||
      item.service_name.toLowerCase().includes(s) ||
      item.plan_name.toLowerCase().includes(s) ||
      item.amount.toString().includes(s) ||
      item.status.toLowerCase().includes(s) ||
      dateString.includes(s)
    );
  });

  // Pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Payments Overview
        </h2>
        <p className="text-gray-500 text-sm">
          Track and manage all payment transactions.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        placeholder="Search by transaction ID, order ID, service, plan, amount, date, status..."
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5"
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500 text-sm">
          Loading transactions...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse min-w-[900px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 text-sm hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4 font-medium">{item.id}</td>
                    <td className="py-3 px-4">{item.order_id}</td>
                    <td className="py-3 px-4">{item.service_name}</td>
                    <td className="py-3 px-4">{item.plan_name}</td>
                    <td className="py-3 px-4 font-semibold">${item.amount}</td>
                    <td className="py-3 px-4">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-4 py-1 rounded-xl text-xs font-medium ${statusColor[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
