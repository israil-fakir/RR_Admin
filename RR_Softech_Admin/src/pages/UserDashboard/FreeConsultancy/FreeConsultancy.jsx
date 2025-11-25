import { useEffect, useState } from "react";
import { showAppointments } from "../../../api/UserDashboard/appointments";
import { showAvailabilities } from "../../../api/employee/availabilities";
import AppointmentList from "./AppointmentList";
import BookConsultancyModal from "./BookConsultancyModal";
import { fetchEmployees } from "../../../api/UserDashboard/employee";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Pagination from "../../../components/shared/userDashboard/Pagination";

export default function FreeConsultancy() {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 2;
  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = appointments.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Load Appointments
  const loadAppointments = async () => {
    try {
      const data = await showAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    }
  };

  // Load Employee Availabilities
  const loadAvailabilities = async () => {
    try {
      const data = await showAvailabilities();
      setAvailabilities(data);
    } catch (err) {
      console.error("Failed to load availabilities", err);
    }
  };

  // Load Employees
  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployeeList(data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  useEffect(() => {
    async function loadAll() {
      await Promise.all([
        loadAppointments(),
        loadAvailabilities(),
        loadEmployees(),
      ]);
      setLoading(false);
    }
    loadAll();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading Consultancy Data..."
      />
    );
  }

  return (
    <div className="relative h-full p-8 border border-gray-200 rounded-xl">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-x border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Free Consultancy
              </span>
            </h1>
            <p className="text-slate-600 text-sm">
              Book a free consultancy session with our expert team.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Book Free Consultancy
          </button>
        </div>
      </div>

      {/* APPOINTMENT LIST */}
      <AppointmentList showAppointments={currentItems}  />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}

      {/* MODAL */}
      {openModal && (
        <BookConsultancyModal
          appointments={appointments}
          availabilities={availabilities}
          employeeList={employeeList}
          onClose={() => setOpenModal(false)}
          onSuccess={loadAppointments}
        />
      )}
    </div>
  );
}
