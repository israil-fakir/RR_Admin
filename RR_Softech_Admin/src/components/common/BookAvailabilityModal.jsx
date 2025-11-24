import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { postAvailabilities } from "../../api/employee/availabilities";
import EmployeeBookedTimes from "../shared/admin/EmployeeBookedTimes";

export default function BookAvailabilityModal({ open, onClose, onSuccess }) {
  const [weekday, setWeekday] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const convertToApiTime = (timeString) => {
    return `${timeString}:00.000Z`;
  };
  

  const handleSubmit = async () => {
    if (!weekday || !start || !end) {
      toast.error("Please fill all fields.");
      return;
    }

    const payload = {
      weekday: Number(weekday),
      start_time: convertToApiTime(start),
      end_time: convertToApiTime(end),
    };

    try {
      setLoading(true);
      await postAvailabilities(payload);
      toast.success("Slot booked successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to book slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden relative">

        {/* Left Side – Form */}
        <div className="p-6 md:p-8 bg-gray-50">
          <button
            className="absolute right-4 top-4 text-gray-600 hover:text-black transition"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Book Available Time
          </h2>

          {/* Weekday */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekday
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
            >
              <option value="">Select Day</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>

          {/* Start Time */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          {/* End Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Availability"}
          </button>
        </div>

        {/* Right Side – Booked Schedule */}
        <div className="border-l bg-white p-4 md:p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Existing Booked Times
          </h3>
          <EmployeeBookedTimes />
        </div>
      </div>
    </div>
  );
}
