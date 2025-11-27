import React, { useEffect, useState } from "react";
import { fetchServices } from "../../../api/UserDashboard/Service";
import ServiceCard from "./ServiceCard";
import ServiceDetailsModal from "./ServiceDetailsModal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ViewAllOrderBtn from "../../../components/shared/userDashboard/ViewAllOrderBtn";
import Pagination from "../../../components/shared/userDashboard/Pagination";

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = services.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchServices();
        setServices(res);
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleViewPlans = (service) => setSelectedService(service);
  const handleCloseModal = () => setSelectedService(null);

  if (loading) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading Services List..."
      />
    );
  }

  return (
    <section className="relative h-full p-8 border border-gray-200 rounded-xl">
      <div className="bg-white rounded-2xl shadow-x border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title Section */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Our Services
              </span>
            </h1>
            <p className="text-slate-600 text-sm">
              Choose from our comprehensive range of digital services designed
              to elevate your business.
            </p>
          </div>
          <ViewAllOrderBtn />
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid gap-6 sm:gap-7 lg:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {currentItems.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onViewPlans={handleViewPlans}
          />
        ))}
      </div>

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
      <ServiceDetailsModal
        isOpen={!!selectedService}
        service={selectedService}
        onClose={handleCloseModal}
      />
    </section>
  );
}
