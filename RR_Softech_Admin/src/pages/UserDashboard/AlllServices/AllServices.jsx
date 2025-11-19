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

  const handleViewPlans = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-lg font-semibold text-gray-600">
            Loading services…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-2 ">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 ">
          Choose from our comprehensive range of digital services designed to
          elevate your business
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onViewPlans={handleViewPlans}
          />
        ))}
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={!!selectedService}
        service={selectedService}
        onClose={handleCloseModal}
      />
    </div>
  );
}
