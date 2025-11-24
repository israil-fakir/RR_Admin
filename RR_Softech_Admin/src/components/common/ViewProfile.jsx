import React from "react";
import { X, Mail, Phone, User, Building2, ShieldCheck, Calendar } from "lucide-react";

export default function ViewProfile({ open, onClose, user, onEdit }) {
  if (!open || !user) return null;

  const {
    email,
    first_name,
    last_name,
    phone_number,
    company_name,
    role,
  } = user;

  const fullName =
    (first_name || last_name)
      ? `${first_name || ""} ${last_name || ""}`.trim()
      : "No Name Provided";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative animate-fadeIn">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl">
          <h1 className="text-2xl font-semibold">{fullName}</h1>
          <p className="text-sm opacity-90 flex items-center gap-2 mt-1">
            <ShieldCheck size={16} /> {role}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InfoRow icon={<Mail size={18} />} label="Email" value={email} />
            <InfoRow icon={<Phone size={18} />} label="Phone" value={phone_number || "N/A"} />
            <InfoRow icon={<User size={18} />} label="First Name" value={first_name || "N/A"} />
            <InfoRow icon={<User size={18} />} label="Last Name" value={last_name || "N/A"} />
            <InfoRow icon={<Building2 size={18} />} label="Company" value={company_name || "N/A"} />

          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Edit Profile
          </button>

        </div>
      </div>
    </div>
  );
}

/* Small reusable row component */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex flex-col border border-gray-100 p-4 rounded-xl shadow-sm bg-gray-50">
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
        {icon} {label}
      </div>
      <div className="text-gray-900 font-medium">{value}</div>
    </div>
  );
}
