import jsPDF from "jspdf";
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchTransactionsall } from "../../../api/UserDashboard/transaction";
import { fetchUserDetails } from "../../../api/admin/users";
import { statusColors } from "../../../utils/UserDashboard/services/statusColors";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function TransactionDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(location?.state?.item || null);
  const [userSummary, setUserSummary] = useState(null);
  const [loading, setLoading] = useState(!transaction);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    async function ensureTransaction() {
      if (transaction) return;
      setLoading(true);
      try {
        const all = await fetchTransactionsall();
        const found = (all || []).find((t) => String(t.id) === String(id));
        setTransaction(found || null);
      } catch (err) {
        console.error("Failed to load transactions fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    ensureTransaction();
  }, [id, transaction]);

  useEffect(() => {
    async function loadUserSummary() {
      if (!transaction?.user_id) return;
      setUserLoading(true);
      try {
        const userData = await fetchUserDetails(transaction.user_id);
        setUserSummary(userData);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setUserLoading(false);
      }
    }
    loadUserSummary();
  }, [transaction]);

  const userFullName = useMemo(() => {
    if (!userSummary) return transaction?.user_name || "N/A";
    return (
      `${userSummary.first_name || ""} ${userSummary.last_name || ""}`.trim() ||
      userSummary.email
    );
  }, [userSummary, transaction]);

  const generatePDF = () => {
    if (!transaction) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 40;
    let y = 60;

    doc.setFontSize(18);
    doc.text("Transaction Summary", left, y);
    y += 22;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, left, y);
    y += 18;
    doc.setDrawColor(200);
    doc.line(left, y, 555, y);
    y += 16;

    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text("Transaction Details", left, y);
    y += 14;

    const txDetails = [
      ["Transaction ID", transaction.id],
      ["Order", transaction.order ?? "N/A"],
      ["Milestone", transaction.milestone ?? "N/A"],
      [
        "Plan / Milestone Title",
        transaction.milestone_title || transaction.plan_name || "N/A",
      ],
      ["Amount", `$${transaction.amount}`],
      ["Status", transaction.status],
      ["Provider", transaction.provider_name || "N/A"],
      ["Timestamp", new Date(transaction.timestamp).toLocaleString()],
      ["Gateway TXID", transaction.gateway_txid_out || "N/A"],
      ["Gateway Coin", transaction.gateway_coin_type || "N/A"],
      ["Gateway Value (coin)", transaction.gateway_value_in_coin ?? "N/A"],
      ["Proof Reference", transaction.proof_reference_number || "N/A"],
    ];

    doc.setFontSize(11);
    txDetails.forEach(([label, value]) => {
      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, left, y);
      doc.setFont(undefined, "normal");
      doc.text(String(value), left + 150, y);
      y += 14;
      if (y > 740) {
        doc.addPage();
        y = 40;
      }
    });

    y += 8;
    doc.setDrawColor(200);
    doc.line(left, y, 555, y);
    y += 16;

    if (userSummary) {
      doc.setFontSize(12);
      doc.text("User Summary", left, y);
      y += 14;
      const u = userSummary;
      const userDetails = [
        ["User ID", u.id],
        [
          "Name",
          `${u.first_name || ""} ${u.last_name || ""}`.trim() || "N/A",
        ],
        ["Email", u.email || "N/A"],
        ["Company", u.company_name || "N/A"],
        ["Phone", u.phone_number || "N/A"],
      ];
      userDetails.forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, left, y);
        doc.setFont(undefined, "normal");
        doc.text(String(value), left + 150, y);
        y += 14;
        if (y > 740) {
          doc.addPage();
          y = 40;
        }
      });

      y += 6;
      doc.setFontSize(11);
      doc.text("Order Stats", left, y);
      y += 14;
      const os = u.order_stats || {};
      const orderStatEntries = [
        ["Total Orders", os.total_orders ?? 0],
        ["Active / Running", os.active_running ?? 0],
        ["Awaiting Payment", os.awaiting_payment ?? 0],
        ["Completed", os.completed ?? 0],
        ["Cancelled / Rejected", os.cancelled_rejected ?? 0],
      ];
      orderStatEntries.forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, left, y);
        doc.setFont(undefined, "normal");
        doc.text(String(value), left + 150, y);
        y += 14;
        if (y > 740) {
          doc.addPage();
          y = 40;
        }
      });

      y += 6;
      doc.setFontSize(11);
      doc.text("Financial Stats", left, y);
      y += 14;
      const fs = u.financial_stats || {};
      [
        ["Total Spend", `$${fs.total_spend_money ?? 0}`],
        ["Total Pending", `$${fs.total_pending_money ?? 0}`],
      ].forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, left, y);
        doc.setFont(undefined, "normal");
        doc.text(String(value), left + 150, y);
        y += 14;
        if (y > 740) {
          doc.addPage();
          y = 40;
        }
      });

      y += 8;
      doc.setFontSize(11);
      doc.text("Recent Transactions (summary)", left, y);
      y += 14;
      const history = (u.transaction_history || []).slice(0, 10);
      history.forEach((h) => {
        const line = `#${h.id} — ${h.plan_name || h.milestone_title || ""} — $${h.amount
          } — ${h.status}`;
        doc.text(line, left, y);
        y += 12;
        if (y > 740) {
          doc.addPage();
          y = 40;
        }
      });
    }

    doc.save(`transaction_${transaction.id}_summary.pdf`);
  };

  // Shared fullscreen loader
  if (loading) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading transaction details..."
      />
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Transaction Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The requested transaction could not be located in the system.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const DetailRow = ({ label, value, fullWidth = false }) => (
    <div className={`${fullWidth ? "col-span-2" : ""} group`}>
      <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </dt>
      <dd className="text-base font-medium text-slate-900 wrap-break-words group-hover:text-indigo-600 transition-colors duration-150">
        {value || <span className="text-slate-400 italic">N/A</span>}
      </dd>
    </div>
  );

  const StatCard = ({ label, value, icon, color = "indigo" }) => {
    const colorClasses = {
      indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/30",
      emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
      amber: "from-amber-500 to-amber-600 shadow-amber-500/30",
      rose: "from-rose-500 to-rose-600 shadow-rose-500/30",
      slate: "from-slate-500 to-slate-600 shadow-slate-500/30",
    };

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {label}
          </span>
          {icon && (
            <div
              className={`w-8 h-8 rounded-lg bg-linear-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}
            >
              {icon}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      Transaction #{transaction.id}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      Generated on{" "}
                      {new Date(transaction.timestamp).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    <svg
                      className="w-4 h-4 text-slate-600 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-slate-700">
                      {userFullName}
                    </span>
                  </div>

                  <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                    <svg
                      className="w-4 h-4 text-emerald-600 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-emerald-700">
                      ${transaction.amount}
                    </span>
                  </div>

                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[transaction.status] ||
                      "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                    {transaction.status}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>

                <button
                  onClick={generatePDF}
                  className="px-5 py-3 bg-linear-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-600/40 hover:shadow-xl hover:shadow-indigo-600/50 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Transaction Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Primary Transaction Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Transaction Information
                </h2>
              </div>

              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
                  <DetailRow
                    label="Order Number"
                    value={transaction.order ? `#${transaction.order}` : null}
                  />
                  <DetailRow
                    label="Milestone ID"
                    value={transaction.milestone ? `#${transaction.milestone}` : null}
                  />
                  <DetailRow
                    label="Plan / Milestone Title"
                    value={transaction.milestone_title || transaction.plan_name}
                  />
                  <DetailRow
                    label="Amount"
                    value={
                      <span className="text-2xl font-bold text-emerald-600">
                        ${transaction.amount}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Status"
                    value={
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${statusColors[transaction.status] ||
                          "bg-slate-100 text-slate-700"
                          }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        {transaction.status}
                      </span>
                    }
                  />
                  <DetailRow label="Provider" value={transaction.provider_name} />
                  <DetailRow
                    label="Timestamp"
                    value={new Date(transaction.timestamp).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  />
                </dl>
              </div>
            </div>

            {/* Gateway & Payment Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-linear-to-r from-slate-700 to-slate-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Gateway Details
                </h2>
              </div>

              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow
                    label="Gateway Transaction ID"
                    value={
                      transaction.gateway_txid_out ? (
                        <span className="font-mono text-sm bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                          {transaction.gateway_txid_out}
                        </span>
                      ) : null
                    }
                    fullWidth
                  />
                  <DetailRow
                    label="Coin Type"
                    value={transaction.gateway_coin_type}
                  />
                  <DetailRow
                    label="Value in Coin"
                    value={
                      transaction.gateway_value_in_coin
                        ? `${transaction.gateway_value_in_coin}`
                        : null
                    }
                  />
                  <DetailRow
                    label="Proof Reference"
                    value={
                      transaction.proof_reference_number ? (
                        <span className="font-mono text-sm bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block text-amber-800">
                          {transaction.proof_reference_number}
                        </span>
                      ) : null
                    }
                    fullWidth
                  />
                </dl>

                {transaction.proof_screenshot && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Payment Proof Screenshot
                    </h3>
                    <div className="relative group">
                      <img
                        src={transaction.proof_screenshot}
                        alt="Payment proof"
                        className="w-full max-h-80 object-contain border-2 border-slate-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                        <span className="text-white text-sm font-medium">
                          Click to view full size
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: User Summary */}
          <aside className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-6">
              <div className="bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  User Profile
                </h3>
              </div>

              {userLoading ? (
                <div className="p-6 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-600">Loading user data...</p>
                </div>
              ) : userSummary ? (
                <div className="p-6 space-y-6">
                  {/* User Info */}
                  <div className="text-center pb-6 border-b border-slate-200">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/40">
                      {userFullName.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">
                      {userFullName}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {userSummary.email}
                    </p>
                    {userSummary.company_name && (
                      <p className="text-sm font-medium text-slate-700 bg-slate-100 inline-block px-3 py-1 rounded-full">
                        {userSummary.company_name}
                      </p>
                    )}
                    {userSummary.phone_number && (
                      <p className="text-sm text-slate-500 mt-2">
                        {userSummary.phone_number}
                      </p>
                    )}
                  </div>

                  {/* Order Statistics */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Order Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard
                        label="Total"
                        value={userSummary.order_stats?.total_orders ?? 0}
                        icon={
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                        color="indigo"
                      />
                      <StatCard
                        label="Active"
                        value={userSummary.order_stats?.active_running ?? 0}
                        icon={
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                        color="emerald"
                      />
                      <StatCard
                        label="Awaiting"
                        value={userSummary.order_stats?.awaiting_payment ?? 0}
                        icon={
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                        color="amber"
                      />
                      <StatCard
                        label="Completed"
                        value={userSummary.order_stats?.completed ?? 0}
                        icon={
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                        color="emerald"
                      />
                      <StatCard
                        label="Cancelled"
                        value={
                          userSummary.order_stats?.cancelled_rejected ?? 0
                        }
                        icon={
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                        color="rose"
                      />
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Financial Overview
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          Total Spend
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                          $
                          {userSummary.financial_stats?.total_spend_money ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          Pending Amount
                        </span>
                        <span className="text-lg font-bold text-amber-600">
                          $
                          {userSummary.financial_stats?.total_pending_money ??
                            0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Recent Transactions
                    </h4>
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 rounded-lg border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100 sticky top-0 z-10">
                          <tr>
                            <th className="py-3 px-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="py-3 px-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="py-3 px-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {(userSummary.transaction_history || []).length > 0 ? (
                            userSummary.transaction_history.map((t) => (
                              <tr
                                key={t.id}
                                className="hover:bg-slate-50 transition-colors duration-150"
                              >
                                <td className="py-3 px-3 font-medium text-slate-900">
                                  #{t.id}
                                </td>
                                <td className="py-3 px-3 font-semibold text-emerald-600">
                                  ${t.amount}
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[t.status] ||
                                      "bg-slate-100 text-slate-700"
                                      }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                                    {t.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="py-8 px-3 text-center text-slate-500 italic"
                              >
                                No transaction history available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600">
                    No user summary available
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
