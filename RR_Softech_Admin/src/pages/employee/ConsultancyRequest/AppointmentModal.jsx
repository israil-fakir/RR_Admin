import React, { useState } from "react";
import { X, Calendar, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { editMeetingLink } from "../../../api/employee/availabilities";

export default function AppointmentModal({ data, onClose, onSuccess }) {
  const [meetingLink, setMeetingLink] = useState(data.meeting_link || "");
  const [saving, setSaving] = useState(false);

  const start = new Date(data.start_time);
  const end = new Date(data.end_time);

  async function handleSave() {
    try {
      setSaving(true);
      const payload = { meeting_link: meetingLink };
      await editMeetingLink(data.id, payload);

      toast.success("Meeting link updated successfully.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to update meeting link.");
      console.log(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}   // ⬅️ slower backdrop fade
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.4, ease: "easeOut" }}  // ⬅️ slower, smoother
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-emerald-500 to-green-500">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Appointment #{data.id}
            </h2>
            <p className="text-xs text-emerald-100">
              Review the schedule and attach a meeting link
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/15 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Time block */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 flex items-start gap-3">
            <div className="mt-1">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-sm text-slate-700 space-y-1">
              <p className="font-semibold text-slate-800">Scheduled Time</p>
              <p>
                <span className="font-medium text-slate-600">Start:</span>{" "}
                {start.toLocaleString()}
              </p>
              <p>
                <span className="font-medium text-slate-600">End:</span>{" "}
                {end.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Meeting link input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Link2 className="w-4 h-4 text-emerald-500" />
              Meeting Link
            </label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xxx-xxxx"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-400">
              Paste a Google Meet, Zoom, or other online meeting URL.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={handleSave}
            disabled={saving || !meetingLink.trim()}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md shadow-emerald-300/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save & Confirm"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
