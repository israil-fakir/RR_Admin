import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { registerUser } from "../../../api/auth";

export default function UserModal({ isOpen, onClose, onUserAdded }) {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "EMPLOYEE",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userData.first_name || !userData.email || !userData.password) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(userData);

      if (response.success) {
        toast.success("User registered successfully — awaiting activation.");

        // Refresh parent list
        onUserAdded();  

        // Close modal
        onClose();

        // Reset form
        setUserData({
          first_name: "",
          last_name: "",
          email: "",
          role: "EMPLOYEE",
          password: "",
        });
      } else {
        toast.error(response.message || "Failed to register user.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5 text-center">
          Add New User
        </h2>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">First Name *</label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mt-3">
          <label className="text-sm font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Role */}
        <div className="mt-3">
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="CUSTOMER">CUSTOMER</option>
          </select>
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register User"}
        </button>
      </div>
    </div>
  );
}
