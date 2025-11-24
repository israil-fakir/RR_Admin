import { useState } from "react";

function ServiceDescription({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-gray-600 leading-relaxed ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 font-medium hover:underline"
      >
        {expanded ? "See Less" : "See More"}
      </button>
    </div>
  );
}

export default ServiceDescription;
