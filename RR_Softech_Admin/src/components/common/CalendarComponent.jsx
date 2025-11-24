import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarComponent({ selectedDate, onChange }) {
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded-xl shadow p-4">
        <Calendar
          onChange={onChange}
          value={selectedDate}
          minDate={new Date()}  // Disable past dates
          className="rounded-lg border-none"
        />
      </div>
    </div>
  );
}
