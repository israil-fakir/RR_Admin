import React from "react";
import {
  FileText,
  CalendarDays,
  Eye,
  Smartphone,
  MonitorSmartphone,
  LayoutTemplate,
  Search,
  MousePointerClick,
  Share2,
  PenTool,
} from "lucide-react";
import { statusColors } from "../../../utils/UserDashboard/services/statusColors";

function getOrderIcon(planDetails = "") {
  const text = (planDetails || "").toLowerCase();

  // Android / mobile apps
  if (text.includes("android") || text.includes("mobile")) {
    return Smartphone;
  }

  // Web design / web development / website
  if (
    text.includes("web design") ||
    text.includes("web development") ||
    text.includes("website") ||
    text.includes("web")
  ) {
    return LayoutTemplate;
  }

  // SEO packages
  if (text.includes("seo")) {
    return Search;
  }

  // PPC / paid ads
  if (
    text.includes("ppc") ||
    text.includes("google ads") ||
    text.includes("adwords") ||
    text.includes("paid ads")
  ) {
    return MousePointerClick;
  }

  // Social media marketing
  if (
    text.includes("social media") ||
    text.includes("facebook") ||
    text.includes("instagram") ||
    text.includes("linkedin")
  ) {
    return Share2;
  }

  // Content and graphics
  if (
    text.includes("content") ||
    text.includes("graphics") ||
    text.includes("copywriting") ||
    text.includes("design")
  ) {
    return PenTool;
  }

  // Desktop / software
  if (text.includes("desktop") || text.includes("software")) {
    return MonitorSmartphone;
  }

  // Fallback
  return FileText;
}

export default function OrderCard({
  order,
  onViewDetails,
  viewMode = "grid",
}) {
  const { id, plan_details, status, created_at, plan_price } = order;

  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const Icon = getOrderIcon(plan_details);
  const isList = viewMode === "list";

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className={isList ? "p-4" : "p-5 h-[140px]"}>
        {isList ? (
          /* ========== LIST VIEW ========== */
          <div className="flex items-center justify-between gap-4">
            {/* LEFT: dynamic icon + title */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <Icon className="text-blue-600 w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                {plan_details || "Product Details here"} {id}
              </h3>
            </div>

            {/* RIGHT: amount + date + status + eye */}
            <div className="flex items-center gap-3 flex-shrink-0 text-sm">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                ${plan_price || 0}
              </p>

              <div className="flex items-center gap-1.5 text-gray-500">
                <CalendarDays size={14} strokeWidth={2} />
                <span>{formattedDate || "00 00 0000"}</span>
              </div>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap ${statusColors[status]}`}
              >
                {status || "No Status"}
              </span>

              <button
                type="button"
                onClick={onViewDetails}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Eye size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          /* ========== GRID VIEW ========== */
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1 basis-24">
              <div className="p-2.5 rounded-lg bg-blue-50 mt-0.5">
                <Icon className="text-blue-600 w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 line-clamp-2">
                  {plan_details || "Product Details here"} {id}
                </h3>
                <p className="text-lg font-bold text-gray-900 mb-1.5">
                  ${plan_price || 0}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CalendarDays size={14} strokeWidth={2} />
                  <span>{formattedDate || "00 00 0000"}</span>
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap ${statusColors[status]}`}
            >
              {status || "No Status"}
            </span>
          </div>
        )}
      </div>

      {/* Bottom button only for grid view */}
      {!isList && (
        <div className="p-5">
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
          >
            <Eye size={16} strokeWidth={2} />
            <span>View Details</span>
          </button>
        </div>
      )}
    </div>
  );
}
