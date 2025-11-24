import React, { useEffect, useState } from "react";
import { CalendarCheck, Clock, User, Video, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { showAppointments } from "../../../api/UserDashboard/appointments";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import AppointmentModal from "../../employee/ConsultancyRequest/AppointmentModal";

export default function ConsultancyRequestAdmin() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  async function loadAppointments() {
    const response = await showAppointments();
    setAppointments(response || []);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const totalPages = Math.ceil(appointments.length / pageSize);
  const paginatedItems = appointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyles = (status) => {
    if (status === "CONFIRMED") {
      return {
        strip: "bg-emerald-500",
        chip: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        timeBg: "from-emerald-50 to-slate-50",
      };
    }
    if (status === "PENDING") {
      return {
        strip: "bg-amber-400",
        chip: "bg-amber-50 text-amber-600 border border-amber-100",
        timeBg: "from-amber-50 to-slate-50",
      };
    }
    return {
      strip: "bg-rose-400",
      chip: "bg-rose-50 text-rose-600 border border-rose-100",
      timeBg: "from-rose-50 to-slate-50",
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-left text-slate-900">
        Consultancy Requests
      </h2>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 mdx:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {paginatedItems.map((item) => {
          const { strip, chip, timeBg } = getStatusStyles(item.status);
          const hasMeetingLink = !!item.meeting_link;

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, rotate: -0.3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedAppointment(item)}
              className="relative text-left cursor-pointer"
            >
              <div
                className="relative bg-white rounded-2xl border border-slate-200
                            shadow-[0_8px_24px_rgba(148,163,184,0.20)]
                            hover:shadow-[0_14px_32px_rgba(148,163,184,0.28)]
                            transition-all duration-200 overflow-hidden"
              >
                {/* left colored strip */}
                <div className={`absolute inset-y-0 left-0 w-[4px] ${strip}`} />

                <div className="px-5 py-4 pl-7">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                        Appointment
                      </p>
                      <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-1">
                        #{item.id}
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${chip}`}
                      >
                        {item.status}
                      </span>
                      {hasMeetingLink && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 text-[11px] font-medium">
                          <Video className="w-3 h-3" />
                          Link added
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requested By / To */}
                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                    {/* Requested By */}
                    <div className="flex gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <User size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                          Requested By
                        </p>
                        <p className="font-medium truncate">
                          {item.customer.first_name} {item.customer.last_name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {item.customer.email}
                        </p>
                      </div>
                    </div>

                    {/* Requested To */}
                    <div className="flex gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                          Requested To
                        </p>
                        <p className="font-medium truncate">
                          {item.employee.first_name} {item.employee.last_name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {item.employee.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time info */}
                  <div
                    className={`mt-4 rounded-xl bg-gradient-to-r ${timeBg} px-3 py-3 text-xs sm:text-sm text-slate-700 space-y-1.5 border border-slate-100`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-sky-500" />
                      <span className="font-medium">Start:</span>
                      <span className="truncate">
                        {formatDateTime(item.start_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarCheck size={15} className="text-emerald-500" />
                      <span className="font-medium">End:</span>
                      <span className="truncate">
                        {formatDateTime(item.end_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <AppointmentModal
          data={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={loadAppointments}
        />
      )}
    </div>
  );
}
