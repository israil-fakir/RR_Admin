import React, { useState, useEffect, useMemo } from "react";
import { X, Calendar, User, Clock, FileText } from "lucide-react";
import { toast } from "react-toastify";

import { postAppointments } from "../../../api/UserDashboard/appointments";
import { fetchEmployees } from "../../../api/UserDashboard/employee";
import { fetchAvailableSlots } from "../../../api/UserDashboard/availableSlot";
import CalendarComponent from "../../../components/common/CalendarComponent";

/**
 * BookConsultancyModal
 * - Two selects (start & end) enforcing continuity (end must be a later slot).
 * - Resets start/end when employee or date changes.
 * - Builds ISO start_time and end_time payload for backend.
 */
export default function BookConsultancyModal({ onClose, onSuccess }) {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  const [selectedDate, setSelectedDate] = useState(null); // Calendar should give Date
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedStart, setSelectedStart] = useState(""); // "HH:mm"
  const [selectedEnd, setSelectedEnd] = useState(""); // "HH:mm"

  const [notes, setNotes] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // -------------------------
  // Utilities
  // -------------------------
  const toYMD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  // Convert "HH:mm" and Date -> ISO string (Z)
  const timeStringToISO = (timeStr, dateObj) => {
    if (!timeStr || !dateObj) return null;
    const [hh, mm] = timeStr.split(":").map((v) => Number(v));
    const d = new Date(dateObj);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  };

  // Basic comparator: minutes since midnight
  const minutesOf = (timeStr) => {
    const [hh, mm] = timeStr.split(":").map(Number);
    return hh * 60 + mm;
  };

  // Duration string between two "HH:mm"
  const durationBetween = (start, end) => {
    const mins = minutesOf(end) - minutesOf(start);
    if (mins <= 0) return "0m";
    if (mins % 60 === 0) return `${mins / 60}h`;
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  // -------------------------
  // Load employees once
  // -------------------------
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchEmployees();
        if (!mounted) return;
        setEmployeeList(res || []);
      } catch (err) {
        console.error("fetchEmployees:", err);
        toast.error("Failed to load employees.");
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------
  // Fetch available slots when employeeId OR date changes
  // -------------------------
  useEffect(() => {
    const fetchSlots = async () => {
      setSelectedStart("");
      setSelectedEnd("");
      setAvailableTimes([]);

      if (!employeeId || !selectedDate) return;

      setLoadingSlots(true);
      try {
        const formattedDate = toYMD(selectedDate); // YYYY-MM-DD
        const res = await fetchAvailableSlots(formattedDate, employeeId);
        const sorted = (res || [])
          .slice()
          .sort((a, b) => minutesOf(a) - minutesOf(b));
        setAvailableTimes(sorted);
      } catch (err) {
        console.error("fetchAvailableSlots:", err);
        toast.error("Failed to load available slots.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, selectedDate]);

  // -------------------------
  // Derived end options
  // -------------------------
  const endOptions = useMemo(() => {
    if (!selectedStart) return [];
    return availableTimes.filter((t) => minutesOf(t) > minutesOf(selectedStart));
  }, [availableTimes, selectedStart]);

  useEffect(() => {
    if (!selectedStart) {
      setSelectedEnd("");
      return;
    }
    if (selectedEnd && minutesOf(selectedEnd) <= minutesOf(selectedStart)) {
      setSelectedEnd("");
    }
  }, [selectedStart, selectedEnd]);

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async () => {
    if (!employeeId) return toast.error("Please select an employee.");
    if (!selectedDate) return toast.error("Please select a date.");
    if (!selectedStart) return toast.error("Please select a start time.");
    if (!selectedEnd) return toast.error("Please select an end time.");

    const startISO = timeStringToISO(selectedStart, selectedDate);
    const endISO = timeStringToISO(selectedEnd, selectedDate);

    if (minutesOf(selectedEnd) <= minutesOf(selectedStart)) {
      return toast.error("End time must be after start time.");
    }

    const payload = {
      employee_id: Number(employeeId),
      start_time: startISO,
      end_time: endISO,
      notes: notes.trim() || "No notes",
    };

    console.log("Submitting appointment payload:", payload);

    try {
      setLoadingSubmit(true);
      await postAppointments(payload);
      toast.success("Booking Confirmed!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("postAppointments error:", err);
      toast.error("Failed to create appointment.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const isSubmitDisabled =
    !employeeId || !selectedDate || !selectedStart || !selectedEnd || loadingSubmit;

  return (
    // OVERLAY – only centers the card, no scrolling here
    <div
      className="
        fixed inset-0 bg-black/40 backdrop-blur-sm z-50
        flex items-center justify-center
        p-4
      "
    >
      {/* MODAL CARD – limited to viewport height and scrolls internally */}
      <div
        className="
          bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative animate-fadeIn
          max-h-[90vh] overflow-y-auto no-scrollbar
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-600 hover:text-black transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Book a Meeting
        </h2>

        {/* Employee */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User size={18} /> Select Employee
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            aria-label="Select employee"
          >
            <option value="">Choose employee</option>
            {employeeList.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={18} /> Select Date
          </label>
          <CalendarComponent
            onChange={(date) => setSelectedDate(date)}
            selectedDate={selectedDate}
          />
        </div>

        {/* Start & End selectors */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} /> Start Time
            </label>

            {loadingSlots ? (
              <div className="text-sm text-gray-500 py-2">Loading slots...</div>
            ) : (
              <select
                value={selectedStart}
                onChange={(e) => setSelectedStart(e.target.value)}
                disabled={!availableTimes.length}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                aria-label="Select start time"
              >
                <option value="">
                  {availableTimes.length ? "Choose start time" : "No slots"}
                </option>
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} /> End Time
            </label>

            <select
              value={selectedEnd}
              onChange={(e) => setSelectedEnd(e.target.value)}
              disabled={!selectedStart || !endOptions.length}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              aria-label="Select end time"
            >
              <option value="">
                {selectedStart
                  ? endOptions.length
                    ? "Choose end time"
                    : "No valid end times"
                  : "Select start first"}
              </option>
              {endOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration preview */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Duration
          </label>
          <div className="text-sm text-gray-700">
            {selectedStart && selectedEnd ? (
              <strong>{durationBetween(selectedStart, selectedEnd)}</strong>
            ) : (
              <span className="text-gray-500">
                Select start and end to see duration
              </span>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText size={16} /> Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write notes (optional)..."
            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-lg font-medium shadow transition ${
            isSubmitDisabled
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loadingSubmit ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
