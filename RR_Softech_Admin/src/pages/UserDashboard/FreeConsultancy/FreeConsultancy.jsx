import { useEffect, useState } from "react";
import { showAppointments } from "../../../api/UserDashboard/appointments";
import { showAvailabilities } from "../../../api/employee/availabilities";
import AppointmentList from "./AppointmentList";
import BookConsultancyModal from "./BookConsultancyModal";
import { fetchEmployees } from "../../../api/UserDashboard/employee";

export default function FreeConsultancy() {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
    const [employeeList,setEmployeeList] = useState([])

  const loadAppointments = async () => {
    try {
      const data = await showAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    }
  };

  // Load employee availabilities
  const loadAvailabilities = async () => {
    try {
      const data = await showAvailabilities();
      setAvailabilities(data);
    } catch (err) {
      console.error("Failed to load availabilities", err);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployeeList(data);
    } catch (err) {
      console.error("Failed to load availabilities", err);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadAvailabilities();
    loadEmployees();
  }, []);

  return (
    <div className="p-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Free Consultancy
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Book Free Consultancy
        </button>
      </div>

      {/* APPOINTMENT LIST */}
      <AppointmentList showAppointments={appointments} />

      {/* BOOKING MODAL */}
      {openModal && (
        <BookConsultancyModal
          appointments={appointments}
          availabilities={availabilities}
          employeeList = {employeeList}
          onClose={() => setOpenModal(false)}
          onSuccess={loadAppointments}
        />
      )}
    </div>
  );
}
