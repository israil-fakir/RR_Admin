// StatCard.jsx
import React from "react";
import clsx from "clsx";

const trendColors = {
  neutral: "text-gray-500",
  up: "text-emerald-500",
  down: "text-rose-500",
};

const StatCard = ({
  title,
  value,
  desc,
  trend,
  accentColor = "from-indigo-500/80 to-sky-500/80",
  clickable = false,
  onClick,
}) => {
  const Wrapper = clickable ? "button" : "div";

  return (
    <Wrapper
      type={clickable ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "group relative flex flex-col gap-1.5",
        "rounded-2xl border border-gray-100/80 bg-white/80",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "hover:-translate-y-0.5",
        "p-4 sm:p-5",
        clickable &&
          "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      )}
    >
      {/* Accent bar */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-x-4 -top-px h-0.5",
          "bg-gradient-to-r",
          accentColor,
          "rounded-full opacity-70"
        )}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <div className="flex items-baseline justify-between gap-2">
        <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
          {value}
        </p>
        {trend && (
          <p
            className={clsx(
              "text-xs font-medium",
              trendColors[trend] || trendColors.neutral
            )}
          >
            {trend === "up" && "▲ "}
            {trend === "down" && "▼ "}
            {trend === "neutral" && "● "}
            {desc}
          </p>
        )}
      </div>

      {!trend && (
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      )}
    </Wrapper>
  );
};

export default StatCard;
