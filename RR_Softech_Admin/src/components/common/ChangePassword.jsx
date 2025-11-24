import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { changePasswordApi } from "../../api/auth";
import CommonForm from "./CommonForm";
import useAuth from "../../hooks/UserDashboard/useAuth";
import { useNavigate } from "react-router-dom";
import { changeFields } from "../../utils/UserDashboard/services/changeFields";
import { handleApiError } from "../../utils/UserDashboard/services/handleApiError";

export default function ChangePassword() {
    const navigate = useNavigate();
    const { logout } = useAuth();
  motion;


  async function handleChangePassword(values) {
    try {
      const access = localStorage.getItem("auth_access");
      if (!access) {
        toast.error("You must be logged in to change password");
        return;
      }
      const res = await changePasswordApi(access, {
        old_password: values.old_password,
        new_password: values.new_password,
      });
      toast.success(res.message || "Password updated successfully! Please Log in with New Password");
      // log out user for safety
      logout();
      navigate("/login");   

    } catch (err) {
      if (err.response?.data.old_password === "Wrong password.") {
        toast.error("The old password you entered is incorrect.");
        return;
      }
      handleApiError(err, "Failed to change password");
      throw err;
    }
  }
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-md w-full bg-white rounded-2xl shadow-xl p-6"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
      >
        {/* Logo and close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div >
              <h1 className="text-2xl font-bold pl-8 lg:pl-0">
                RR <span className="text-orange-400 ">Softech</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-center">Change Password</h3>
        </div>
        <CommonForm
          fields={changeFields}
          submitLabel="Change password"
          onSubmit={handleChangePassword}
        />
      </motion.div>
    </motion.div>
  );
}
