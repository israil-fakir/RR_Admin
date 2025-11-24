import React, { useEffect, useState } from "react";
import { fetchServices } from "../../../api/UserDashboard/Service";
import ServiceCard from "./ServiceCard";
import ServiceDetailsModal from "./ServiceDetailsModal";

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

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
      <div className="flex justify-center items-center min-h-[50vh] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-base sm:text-lg font-semibold text-gray-600">
            Loading services…
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
            Our Services
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl">
            Choose from our comprehensive range of digital services designed to
            elevate your business.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid gap-5 sm:gap-6 lg:gap-8 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 mdx:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewPlans={handleViewPlans}
            />
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={!!selectedService}
        service={selectedService}
        onClose={handleCloseModal}
      />
    </section>
  );
}
