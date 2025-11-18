import { ArrowRight, Layers } from "lucide-react";
import ServiceDescription from "../../../components/common/ServiceDescription";

export default function ServiceCard({ service, onViewPlans }) {
  const planCount = service.plans?.length || 0;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Content */}
      <div className="p-8">
        {/* Service Name */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {service.name}
          </h3>
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              {planCount} {planCount === 1 ? "Plan" : "Plans"}
            </span>
          </div>
        </div>

        {/* Description */}
        <ServiceDescription text={service.description} />

        {/* CTA Button */}
        <button
          onClick={() => onViewPlans(service)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group shadow-md hover:shadow-xl"
        >
          <span>View Plans & Details</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
