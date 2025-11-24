import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import UserModal from "../../../components/shared/admin/UserModel";
import UserDetailsModal from "./UserDetailsModal";
import SearchBar from "../../../components/shared/admin/SearchBar";
import {
  fetchAllProfile,
  fetchEachProfile,
  editRoleInfo,
  deleteUser,
} from "../../../api/UserDashboard/profileInfo";
import { toast } from "react-toastify";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | INACTIVE
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL | EMPLOYEE | CUSTOMER

  const loadUsers = async () => {
    try {
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

  const openProfileModal = async (id) => {
    try {
      const profile = await fetchEachProfile(id);
      if (!profile) {
        toast.error("Cannot fetch user details");
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
        joined: profile.date_joined
          ? profile.date_joined.split("T")[0]
          : null,
        raw: profile,
      };
      setSelectedUser(normalized);
      setOpenDetailsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };

  const handleToggleRole = async (userId, newRole, newIsActive) => {
    try {
      const payload = {
        role: newRole,
        is_active: newIsActive,
      };
      await editRoleInfo(payload, userId);
      await loadUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser((s) => ({
          ...s,
          role: newRole,
          is_active: newIsActive,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;
    try {
      await deleteUser(userId);
      await loadUsers();
      setOpenDetailsModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Users Management</h1>
          <p className="text-gray-500 text-sm">
            Manage registered users and their roles/active status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
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
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${statusFilter === "ALL"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => setStatusFilter("ALL")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${statusFilter === "ACTIVE"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => setStatusFilter("ACTIVE")}
            >
              Active
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${statusFilter === "INACTIVE"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => setStatusFilter("INACTIVE")}
            >
              Inactive
            </button>
          </div>

          {/* Role filter */}
          <div className="flex gap-2 items-center">
            <select
              className="px-3 py-1 rounded-md border text-sm"
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

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 mdx:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => openProfileModal(user.id)}
            className="group relative text-left bg-white border border-slate-200/70 rounded-xl shadow-sm 
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 
                  flex flex-col justify-between h-full overflow-hidden"
          >
            {/* CURVED LEFT BORDER STRIP */}
            <div
              className={`absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg 
          ${user.is_active ? "bg-emerald-500" : "bg-rose-500"}
        `}
            />

            {/* Card content */}
            <div className="relative p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold text-lg">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-gray-500 text-sm truncate">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full 
              ${user.is_active
                      ? "bg-blue-100 text-blue-600"
                      : "bg-rose-100 text-rose-600"
                    }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>

                <div className="text-right text-xs sm:text-sm">
                  <p className="text-gray-400">
                    Joined {user.joined || "—"}
                  </p>
                  <p className="font-medium text-slate-700 uppercase tracking-wide">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>


      {/* Add User Modal */}
      <UserModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onUserAdded={loadUsers}
      />

      {/* Details Modal */}
      <UserDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        user={selectedUser}
        onToggleRole={handleToggleRole}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default UsersManagement;
