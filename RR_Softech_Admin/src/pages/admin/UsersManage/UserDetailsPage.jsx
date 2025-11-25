import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchEachProfile,
  editRoleInfo,
  deleteUser,
} from "../../../api/UserDashboard/profileInfo";
import { fetchUserDetails } from "../../../api/admin/users";
import { statusColors } from "../../../utils/UserDashboard/services/statusColors";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [basicProfile, setBasicProfile] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [savingRole, setSavingRole] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [id]);

  detailsLoading

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load basic profile first
      const profile = await fetchEachProfile(id);
      if (!profile) {
        toast.error("User not found");
        navigate("/users-manage");
        return;
      }

      const normalized = {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        name:
          `${(profile.first_name || "").trim()} ${(profile.last_name || "").trim()}`.trim() ||
          profile.email ||
          "Unknown",
        role: profile.role || "CUSTOMER",
        is_active: !!profile.is_active,
        joined: profile.date_joined ? profile.date_joined.split("T")[0] : null,
        raw: profile,
      };
      setBasicProfile(normalized);

      // Load detailed data
      setDetailsLoading(true);
      const details = await fetchUserDetails(id);
      setDetailedData(details);
    } catch (err) {
      console.error("Failed to load user data", err);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
      setDetailsLoading(false);
    }
  };

  const handleRoleToggle = async () => {
    if (!basicProfile) return;
    const newRole = basicProfile.role === "EMPLOYEE" ? "CUSTOMER" : "EMPLOYEE";

    try {
      setSavingRole(true);
      await editRoleInfo({ role: newRole, is_active: basicProfile.is_active }, basicProfile.id);
      setBasicProfile((s) => ({ ...s, role: newRole }));
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error("Failed to change role");
      console.error(err);
    } finally {
      setSavingRole(false);
    }
  };

  const handleActiveToggle = async () => {
    if (!basicProfile) return;
    const newIsActive = !basicProfile.is_active;

    try {
      setSavingStatus(true);
      await editRoleInfo({ role: basicProfile.role, is_active: newIsActive }, basicProfile.id);
      setBasicProfile((s) => ({ ...s, is_active: newIsActive }));
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!ok) return;

    try {
      setSavingDelete(true);
      await deleteUser(basicProfile.id);
      toast.success("User deleted successfully");
      navigate("/admin/users-manage");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    } finally {
      setSavingDelete(false);
    }
  };

  const handleTransactionClick = (transaction) => {
    navigate(`/admin/transactions/${transaction.id}/`, { state: { item: transaction } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!basicProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">User Not Found</h2>
          <p className="text-slate-600 mb-6">The requested user could not be located.</p>
          <button
            onClick={() => navigate("/users-manage")}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/30"
          >
            ← Back to Users
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
      <dd className="text-base font-medium text-slate-900 break-words group-hover:text-indigo-600 transition-colors duration-150">
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
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-500/40 flex-shrink-0">
                    {basicProfile.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                      {basicProfile.name}
                    </h1>
                    <p className="text-slate-600 mb-3">{basicProfile.email}</p>

                    {/* Quick Info Pills */}
                    <div className="flex flex-wrap gap-2">
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                          basicProfile.is_active
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                        {basicProfile.is_active ? "Active" : "Inactive"}
                      </div>

                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold uppercase tracking-wide">
                          {basicProfile.role}
                        </span>
                      </div>

                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                        <svg className="w-4 h-4 text-slate-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">
                          Joined {basicProfile.joined || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 lg:w-64">
                <button
                  onClick={() => navigate("/admin/users-manage")}
                  className="px-5 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Users
                </button>

                <button
                  onClick={handleRoleToggle}
                  disabled={savingRole}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-600/40 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {savingRole ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {basicProfile.role === "EMPLOYEE" ? "Make Customer" : "Make Employee"}
                    </>
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={savingDelete}
                  className="px-5 py-3 bg-rose-50 border-2 border-rose-200 text-rose-700 font-semibold rounded-xl hover:bg-rose-100 hover:border-rose-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {savingDelete ? (
                    <>
                      <div className="w-4 h-4 border-2 border-rose-700 border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: User Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h2>
              </div>

              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailRow label="User ID" value={`#${basicProfile.id}`} />
                  <DetailRow label="Email Address" value={basicProfile.email} />
                  <DetailRow label="First Name" value={basicProfile.first_name} />
                  <DetailRow label="Last Name" value={basicProfile.last_name} />
                  <DetailRow
                    label="Company"
                    value={detailedData?.company_name}
                    fullWidth
                  />
                  <DetailRow
                    label="Phone Number"
                    value={detailedData?.phone_number}
                    fullWidth
                  />
                  <DetailRow
                    label="Account Status"
                    value={
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">
                          {basicProfile.is_active ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={handleActiveToggle}
                          disabled={savingStatus}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                            basicProfile.is_active ? "bg-emerald-600" : "bg-slate-300"
                          } ${savingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform bg-white rounded-full shadow transition ${
                              basicProfile.is_active ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    }
                  />
                  <DetailRow label="User Role" value={basicProfile.role} />
                </dl>
              </div>
            </div>

            {/* Transaction History */}
            {detailedData && detailedData.transaction_history && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Transaction History
                    <span className="ml-auto text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                      {detailedData.transaction_history.length} transactions
                    </span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                      <tr>
                        <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Plan/Milestone
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {detailedData.transaction_history.map((tx) => (
                        <tr
                          key={tx.id}
                          onClick={() => handleTransactionClick(tx)}
                          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="py-4 px-6 font-semibold text-slate-900">
                            #{tx.id}
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-slate-900">
                                {tx.plan_name || tx.milestone_title || "N/A"}
                              </p>
                              {tx.provider_name && (
                                <p className="text-xs text-slate-500">
                                  via {tx.provider_name}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-emerald-600">
                            ${tx.amount}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                                statusColors[tx.status] ||
                                "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600">
                            {new Date(tx.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {detailedData.transaction_history.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-slate-600">No transactions yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Statistics */}
          <aside className="space-y-6">
            {/* Order Statistics */}
            {detailedData && detailedData.order_stats && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Order Statistics
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      label="Total"
                      value={detailedData.order_stats.total_orders ?? 0}
                      icon={
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                      value={detailedData.order_stats.active_running ?? 0}
                      icon={
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                      value={detailedData.order_stats.awaiting_payment ?? 0}
                      icon={
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                      value={detailedData.order_stats.completed ?? 0}
                      icon={
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                      value={detailedData.order_stats.cancelled_rejected ?? 0}
                      icon={
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
              </div>
            )}

            {/* Financial Summary */}
            {detailedData && detailedData.financial_stats && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Financial Overview
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                        Total Spend
                      </span>
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-emerald-800">
                      ${detailedData.financial_stats.total_spend_money ?? 0}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                        Pending Amount
                      </span>
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-amber-800">
                      ${detailedData.financial_stats.total_pending_money ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
