import { Calendar, Clock, User, Video, StickyNote } from "lucide-react";

export default function AppointmentList({ showAppointments }) {
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Appointments
      </h2>

      {showAppointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid gap-5 sm:gap-6 lg:gap-8 md:gap-6 mdx:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
          {showAppointments.map((item) => {
            /* ---------- EMPLOYEE INFO FROM API ---------- */
            const employee = item.employee || {};
            const consultantName = employee.first_name
              ? `${employee.first_name} ${employee.last_name || ""}`.trim()
              : "RR Softech Expert";

            const consultantRole = employee.role || "Consultant";
            const consultantEmail = employee.email || "";
            const consultantPhone = employee.phone || "";
            const consultantInitials = getInitials(consultantName);
            /* -------------------------------------------- */

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition overflow-hidden"
              >
                {/* Header */}
                <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    {item.customer.first_name} {item.customer.last_name}
                  </div>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">
                    {item.status}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* LEFT: appointment basics */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <User size={20} className="text-blue-600" />
                        <div>
                          <p className="font-medium">
                            {item.customer.first_name}{" "}
                            {item.customer.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.customer.profile?.phone_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar size={20} className="text-green-600" />
                        <p className="font-medium">
                          {formatDate(item.start_time)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock size={20} className="text-purple-600" />
                        <p className="font-medium">
                          {formatTime(item.start_time)} –{" "}
                          {formatTime(item.end_time)}
                        </p>
                      </div>

                      {item.notes && (
                        <div className="flex items-start gap-3 text-gray-700">
                          <StickyNote
                            size={20}
                            className="text-yellow-600 mt-0.5"
                          />
                          <p className="text-sm">{item.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* RIGHT: employee + schedule */}
                    <div className="w-full md:w-60">
                      <div className="h-full rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white px-4 py-3 flex flex-col justify-between">
                        <div>
                          {/* EMPLOYEE NAME SHOWN HERE */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                              {consultantInitials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {consultantName}
                              </p>
                              <p className="text-xs text-blue-600 font-medium">
                                {consultantRole}
                              </p>
                            </div>
                          </div>

                          {/* Schedule summary */}
                          <div className="mt-1 mb-3 rounded-lg bg-white/70 border border-blue-100 px-3 py-2">
                            <p className="text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                              <Calendar
                                size={13}
                                className="text-green-600"
                              />
                              <span>Appointment schedule</span>
                            </p>
                            <div className="flex flex-col gap-0.5 text-[11px] text-gray-600">
                              <span>{formatDate(item.start_time)}</span>
                              <span>
                                {formatTime(item.start_time)} –{" "}
                                {formatTime(item.end_time)}
                              </span>
                            </div>
                          </div>

                          {/* Contact details */}
                          <div className="space-y-1.5 text-xs text-gray-600">
                            {consultantEmail && (
                              <p className="truncate">
                                <span className="font-semibold">Email: </span>
                                {consultantEmail}
                              </p>
                            )}
                            {consultantPhone && (
                              <p>
                                <span className="font-semibold">Phone: </span>
                                {consultantPhone}
                              </p>
                            )}
                            <p className="pt-1 text-[11px] text-gray-500">
                              This is the RR Softech expert you’ll be meeting
                              with.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Join Meeting */}
                  <div className="pt-4">
                    <button
                      disabled={!item.meeting_link}
                      onClick={() =>
                        window.open(item.meeting_link, "_blank", "noopener")
                      }
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium transition 
                        ${
                          item.meeting_link
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }
                      `}
                    >
                      <Video size={18} />
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
