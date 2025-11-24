// File: UserDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const UserDetailsModal = ({ open, onClose, user, onToggleRole, onDelete }) => {
  const [localUser, setLocalUser] = useState(null);
motion
  const [savingRole, setSavingRole] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);

  useEffect(() => {
    setLocalUser(user ? { ...user } : null);
  }, [user]);

  // -------------------------------
  //       CHANGE ROLE
  // -------------------------------
  const handleRoleToggleClick = async () => {
    if (!localUser) return;
    const newRole = localUser.role === "EMPLOYEE" ? "CUSTOMER" : "EMPLOYEE";

    try {
      setSavingRole(true);
      await onToggleRole(localUser.id, newRole, localUser.is_active);
      setLocalUser((s) => ({ ...s, role: newRole }));
      toast.success("Role updated");
    } catch (err) {
      toast.error("Failed to change role");
      console.log(err);
    } finally {
      setSavingRole(false);
    }
  };

  const handleActiveToggle = async () => {
    if (!localUser) return;
    const newIsActive = !localUser.is_active;

    try {
      setSavingStatus(true);
      await onToggleRole(localUser.id, localUser.role, newIsActive);
      setLocalUser((s) => ({ ...s, is_active: newIsActive }));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
      console.log(err);
    } finally {
      setSavingStatus(false);
    }
  };

  // -------------------------------
  //            DELETE
  // -------------------------------
  const handleDelete = async () => {
    const ok = window.confirm("Delete this user? This action cannot be undone.");
    if (!ok) return;

    try {
      setSavingDelete(true);
      await onDelete(localUser.id);
      toast.success("User deleted");
      onClose();
    } catch (err) {
      toast.error("Failed to delete user");
      console.log(err);
    } finally {
      setSavingDelete(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              !savingRole && !savingStatus && !savingDelete && onClose()
            }
          />

          {/* MODAL */}
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {localUser?.full_name || localUser?.email}
                </h2>
                <p className="text-gray-500 text-sm">{localUser?.email}</p>
              </div>

              <button
                onClick={() =>
                  !savingRole && !savingStatus && !savingDelete && onClose()
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold shadow-inner">
                  {localUser?.full_name?.charAt(0) ||
                    localUser?.email?.charAt(0)}
                </div>

                <p className="mt-3 text-gray-500 text-sm">
                  Role:{" "}
                  <span className="font-semibold text-gray-700">
                    {localUser?.role}
                  </span>
                </p>

                <p className="text-gray-500 text-sm">
                  Joined:{" "}
                  <span className="font-semibold">
                    {localUser?.joined || "—"}
                  </span>
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Full Name</label>
                  <p className="font-medium text-gray-800">
                    {`${localUser?.first_name ?? ""} ${
                      localUser?.last_name ?? ""
                    }`.trim() || "—"}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-gray-800">{localUser?.email}</p>
                </div>

                {/* ACTIVE TOGGLE */}
                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-medium text-gray-700">Active</p>
                    <button
                      onClick={handleActiveToggle}
                      disabled={savingStatus}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition 
                        ${
                          localUser?.is_active
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform bg-white rounded-full shadow transition 
                        ${
                          localUser?.is_active
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL-WIDTH ACTION BUTTONS */}
            <div className="p-6 pt-0 space-y-3">
              {/* Toggle Role */}
              <button
                onClick={handleRoleToggleClick}
                disabled={savingRole}
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                {savingRole
                  ? "Saving..."
                  : localUser?.role === "EMPLOYEE"
                  ? "Make Customer"
                  : "Make Employee"}
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                disabled={savingDelete}
                className="w-full py-3 rounded-lg bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100 transition flex justify-center items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />{" "}
                {savingDelete ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

UserDetailsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  onToggleRole: PropTypes.func,
  onDelete: PropTypes.func,
};

export default UserDetailsModal;
