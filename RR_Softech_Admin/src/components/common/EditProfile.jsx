import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  editProfileInfo,
  fetchEachProfile,
} from "../../api/UserDashboard/profileInfo";
import { toast } from "react-toastify";

export default function EditProfile({ open, onClose, userId, onSuccess }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    phone_number: "",
  });

  useEffect(() => {
    if (open && userId) {
      fetchEachProfile(userId).then((res) => {
        setForm({
          first_name: res.first_name || "",
          last_name: res.last_name || "",
          company_name: res.company_name || "",
          phone_number: res.phone_number || "",
        });
      });
    }
  }, [open, userId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const response = await editProfileInfo(form);
    if (response) {
      toast.success("Information Update Sucessfully");
      onSuccess();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <InputField
            label="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />

          <InputField
            label="Last Name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />

          <InputField
            label="Company Name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
