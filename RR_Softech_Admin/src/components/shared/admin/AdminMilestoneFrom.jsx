import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";
import { postMilestone } from "../../../api/admin/Milestone";
import { toast } from "react-toastify";

export default function AdminMilestoneFrom({ selectedMilestoneId, onReload,autoReload = false }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    due_date: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  motion

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMilestoneId) {
      toast.error("No order selected. Please select an order first.");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      status: "PENDING",
      order: selectedMilestoneId,
    };

    try {
      const res = await postMilestone(payload);

      if (!res) {
        throw new Error("No response returned from server.");
      }

      toast.success("Milestone successfully created!");

      // Reset form
      setForm({
        title: "",
        description: "",
        amount: "",
        due_date: "",
      });

      if (autoReload && typeof onReload === "function") {
        await onReload();
    }
    } catch (err) {
      console.error("Milestone submit error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Milestone submission failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-2xl p-6 md:p-8 mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-medium flex items-center gap-2">
            <Tag size={18} /> Milestone Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter milestone title"
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-medium flex items-center gap-2">
            <FileText size={18} /> Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Write milestone description..."
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            required
          />
        </div>

        {/* Amount & Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <DollarSign size={18} /> Amount
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              required
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <Calendar size={18} /> Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
        >
          {loading ? "Creating..." : "Create Milestone"}
        </motion.button>
      </form>
    </motion.div>
  );
}
