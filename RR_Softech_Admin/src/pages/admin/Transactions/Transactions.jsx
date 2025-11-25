import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import SearchBar from "../../../components/shared/admin/SearchBar";
import { fetchTransactionsall } from "../../../api/UserDashboard/transaction";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import { statusColors } from "./../../../utils/UserDashboard/services/statusColors";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/UserDashboard/useAuth";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Load Data
  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const data = await fetchTransactionsall();
        setTransactions(data || []);
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
    const dateString = new Date(item.timestamp)
      .toLocaleString()
      .toLowerCase();

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

  const generateTransactionPDF = (item) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Transaction Summary", 15, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);

    doc.text(`Generated On: ${new Date().toLocaleString()}`, 15, 30);

    doc.setDrawColor(180);
    doc.line(15, 35, 195, 35);

    // Transaction Details
    doc.setFontSize(14);
    doc.setTextColor(20);
    doc.text("Transaction Details", 15, 50);

    doc.setFontSize(12);
    doc.setTextColor(50);

    const details = [
      ["Transaction ID:", item.id],
      ["Customer Name:", item.user_name || "N/A"],
      ["Email:", item.customer_email || "N/A"],
      ["Plan / Milestone:", item.milestone_title || item.plan_name || "N/A"],
      ["Amount:", `$${item.amount}`],
      ["Provider:", item.provider_name || "N/A"],
      ["Status:", item.status],
      ["Date & Time:", new Date(item.timestamp).toLocaleString()],
      ["Order:", item.order],
      ["Milestone:", item.milestone],
    ];

    let y = 65;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 70, y);
      y += 10;
    });

    // Footer
    doc.setDrawColor(210);
    doc.line(15, y + 5, 195, y + 5);

    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text("This is a system-generated transaction summary.", 15, y + 15);

    // Save
    doc.save(`transaction_${item.id}.pdf`);
  };

  const openDetails = (item) => {
    const base = auth.role === "EMPLOYEE" ? "employee" : "admin";
    navigate(`/${base}/transactions/${item.id}/`, { state: { item } });
  };

  // Fullscreen loader for the initial fetch
  if (loading && !transactions.length) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading Transactions..."
      />
    );
  }

  return (
    <div className="relative bg-gray-50 h-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 border border-gray-200 rounded-xl overflow-x-hidden">
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

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Milestone / Plan</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Provider</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">PDF</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 text-sm hover:bg-gray-100 transition"
                  onClick={() => openDetails(item)}
                >
                  {/* Transaction ID */}
                  <td className="py-3 px-4 font-medium">{item.id}</td>

                  {/* Customer Name or Email */}
                  <td className="py-3 px-4">
                    {item.user_name || item.customer_email || "N/A"}
                  </td>

                  {/* Milestone Title / Plan Name */}
                  <td className="py-3 px-4">
                    {item.milestone_title
                      ? item.milestone_title
                      : item.plan_name || "N/A"}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 font-semibold">${item.amount}</td>

                  {/* Payment Provider */}
                  <td className="py-3 px-4">
                    {item.provider_name || "N/A"}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-4 py-1 rounded-xl text-xs font-medium ${statusColors[item.status]
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Download PDF */}
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row navigation
                        generateTransactionPDF(item);
                      }}
                      className="text-blue-600 underline hover:text-blue-800 text-sm"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
