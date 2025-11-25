import { TrendingUp, X } from "lucide-react";

export default function ModelTitle({ selectedService, onClose }) {

  const planPriceStr = selectedService.plan_price.replace(/\$|\s*Plan\s*/gi, "").trim();
  const planPrice = parseFloat(planPriceStr);
  const total = (planPrice * 1.1).toFixed(2);
  const ServiceIcon = selectedService.icon;

  return (
    <div className="p-6 bg-white shadow-sm">
      <div className="flex items-center mb-6">
        <div className="shrink-0 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
          {ServiceIcon ? (
            <ServiceIcon />
          ) : (
            <TrendingUp className="text-white" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedService.plan_details || "Service Details"}
          </h1>
          <p className="text-base text-gray-500">
            Service Details & Management
          </p>
        </div>

        <div className="ml-4 mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition sm:hidden block"
          >
            <X size={32} />
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 mb-1">Plan</p>
          <p className="text-xl font-bold text-gray-900">{selectedService.plan_details}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total (inc. VAT 10%)</p>
          <p className="text-xl font-bold text-blue-600">
            {isNaN(total) ? "$--.--" : `$${total}`}
          </p>
        </div>
      </div>
    </div>
  );
}
