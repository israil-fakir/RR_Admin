import { ArrowRight, Layers } from "lucide-react";
import ServiceDescription from "../../../components/common/ServiceDescription";

export default function ServiceCard({ service, onViewPlans }) {
  const planCount = service.plans?.length || 0;

  return (
    <article
      className="
        group
        w-full h-full
        flex flex-col
        bg-white
        rounded-2xl
        shadow-lg hover:shadow-2xl
        border border-gray-100
        overflow-hidden
        transition-all duration-300
      "
    >
      {/* content */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6">
        {/* title and badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3
            className="
              text-base sm:text-lg lg:text-xl
              font-bold
              text-gray-900
              group-hover:text-blue-600
              transition-colors
              wrap-break-words
            "
          >
            {service.name}
          </h3>

          <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-600">
              {planCount} {planCount === 1 ? "Plan" : "Plans"}
            </span>
          </div>
        </div>

        {/* description */}
        <div className="mb-4 flex-1">
          <ServiceDescription text={service.description} />
        </div>

        {/* CTA button */}
        <button
          onClick={() => onViewPlans(service)}
          className="
            w-full
            mt-auto
            py-2.5 sm:py-3
            px-4 sm:px-5
            rounded-xl
            font-semibold
            text-sm sm:text-base
            flex items-center justify-center gap-2
            bg-linear-to-r from-blue-600 to-blue-700
            hover:from-blue-700 hover:to-blue-800
            text-white
            shadow-md hover:shadow-xl
            transition-all duration-300
          "
        >
          <span>View Plans &amp; Details</span>
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
}
