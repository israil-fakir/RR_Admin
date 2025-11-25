import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserModal from "../../../components/shared/admin/UserModel";
import SearchBar from "../../../components/shared/admin/SearchBar";
import { fetchAllProfile } from "../../../api/UserDashboard/profileInfo";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true); // start in loading state

  // Filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | INACTIVE
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL | EMPLOYEE | CUSTOMER

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProfile();
      const visible = (data || []).filter((u) => u.role !== "OWNER");
      const normalized = visible.map((u) => ({
        id: u.id,
        email: u.email,
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        name:
          `${(u.first_name || "").trim()} ${(u.last_name || "").trim()}`.trim() ||
          u.email ||
          "Unknown",
        role: u.role || "CUSTOMER",
        is_active: !!u.is_active,
        joined: u.date_joined ? u.date_joined.split("T")[0] : null,
        raw: u,
      }));
      setUsers(normalized);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtering pipeline
  const filteredUsers = users.filter((user) => {
    const q = searchTerm?.trim().toLowerCase();
    const matchesQ =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q);
    if (!matchesQ) return false;

    if (statusFilter === "ACTIVE" && !user.is_active) return false;
    if (statusFilter === "INACTIVE" && user.is_active) return false;

    if (roleFilter !== "ALL" && user.role !== roleFilter) return false;

    return true;
  });

  const openProfilePage = (userId) => {
    navigate(`/admin/users-manage/${userId}/`);
  };

  // ✅ Single fullscreen loading state (initial load)
  if (loading && !users.length) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading Users..."
      />
    );
  }

  return (
    <div className="relative bg-gray-50 h-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 border border-gray-200 rounded-xl overflow-x-hidden">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Users Management
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    Manage registered users and their roles/active status.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenAddModal(true)}
              className="px-6 py-3 bg-linear-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-600/40 hover:shadow-xl hover:shadow-indigo-600/50 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              {/* Status filters */}
              <div className="flex gap-2 items-center">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    statusFilter === "ALL"
                      ? "bg-slate-800 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setStatusFilter("ALL")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    statusFilter === "ACTIVE"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/40"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setStatusFilter("ACTIVE")}
                >
                  Active
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    statusFilter === "INACTIVE"
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setStatusFilter("INACTIVE")}
                >
                  Inactive
                </button>
              </div>

              {/* Role filter */}
              <div className="flex gap-2 items-center">
                <select
                  className="px-4 py-2 rounded-lg border-2 border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => openProfilePage(user.id)}
              className="group relative text-left bg-white border-2 border-slate-200 rounded-2xl shadow-lg 
                    hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 
                    flex flex-col justify-between h-full overflow-hidden"
            >
              {/* Status Strip */}
              <div
                className={`absolute inset-y-0 left-0 w-1.5 rounded-tr-xl rounded-br-xl 
                  ${
                    user.is_active
                      ? "bg-linear-to-b from-emerald-500 to-emerald-600"
                      : "bg-linear-to-b from-rose-500 to-rose-600"
                  }
                `}
              />

              {/* Card content */}
              <div className="relative p-5 flex flex-col justify-between h-full">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate text-lg group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-slate-500 text-sm truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5
                        ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>

                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {user.joined || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No users found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <UserModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onUserAdded={loadUsers}
      />
    </div>
  );
};

export default UsersManagement;
