import React from "react";
import { FileText, CalendarDays, Eye } from "lucide-react";
import { statusColors } from "../../../utils/UserDashboard/services/statusColors";


export default function OrderCard({ 
  order, 
  onViewDetails, 
}) {
  const { id,plan_details, status, created_at, plan_price } = order;

  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full  bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-5 h-[140px] ">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1 basis-24">
            <div className="p-2.5 rounded-lg bg-blue-50 mt-0.5">
              <FileText className="text-blue-600 w-5 h-5" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 line-clamp-2">
                {plan_details || "Product Details here"} {id}
              </h3>
              <p className="text-lg font-bold text-gray-900 mb-2">
                ${plan_price || 0}
              </p>
              <div>
              </div>
            </div>
          </div>
          <span
            className={` basis-2 px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap  ${statusColors[status]}`}
          >
            {status || "No Status"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 ml-14">
                <CalendarDays size={14} strokeWidth={2} />
                <span>{formattedDate || "00 00 0000"}</span>
              </div>
      </div>
      <div className="p-5 ">
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
        >
          <Eye size={16} strokeWidth={2} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}
