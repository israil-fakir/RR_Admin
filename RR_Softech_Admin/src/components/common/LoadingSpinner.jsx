import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Loading Component
 * 
 * @param {string} variant - "fullscreen" | "card" | "inline" | "overlay"
 * @param {string} size - "sm" | "md" | "lg" | "xl"
 * @param {string} message - Loading message to display
 * @param {string} color - "indigo" | "emerald" | "slate" | "rose" | "amber"
 */
const LoadingSpinner = ({ 
  variant = "fullscreen", 
  size = "md", 
  message = "Loading...",
  color = "indigo" 
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      spinner: "w-8 h-8",
      text: "text-sm",
      container: "p-4"
    },
    md: {
      spinner: "w-12 h-12",
      text: "text-base",
      container: "p-6"
    },
    lg: {
      spinner: "w-16 h-16",
      text: "text-lg",
      container: "p-8"
    },
    xl: {
      spinner: "w-20 h-20",
      text: "text-xl",
      container: "p-10"
    }
  };

  // Color configurations
  const colorConfig = {
    indigo: {
      primary: "border-indigo-600",
      secondary: "border-indigo-200",
      text: "text-indigo-600"
    },
    emerald: {
      primary: "border-emerald-600",
      secondary: "border-emerald-200",
      text: "text-emerald-600"
    },
    slate: {
      primary: "border-slate-600",
      secondary: "border-slate-200",
      text: "text-slate-600"
    },
    rose: {
      primary: "border-rose-600",
      secondary: "border-rose-200",
      text: "text-rose-600"
    },
    amber: {
      primary: "border-amber-600",
      secondary: "border-amber-200",
      text: "text-amber-600"
    }
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  // Spinner component
  const Spinner = () => (
    <div className="relative">
      <div className={`absolute inset-0 ${currentSize.spinner} border-4 ${currentColor.secondary} rounded-full animate-pulse`}></div>
      <div className={`${currentSize.spinner} border-4 ${currentColor.primary} rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );

  // Variant: Fullscreen Loading
  if (variant === "fullscreen") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center border border-gray-200  rounded-xl ">
        <div className={`bg-white rounded-2xl shadow-xl ${currentSize.container} flex flex-col items-center space-y-4`}>
          <Spinner />
          <p className={`${currentColor.text} font-medium ${currentSize.text}`}>{message}</p>
        </div>
      </div>
    );
  }

  // Variant: Card Loading (for inside cards/sections)
  if (variant === "card") {
    return (
      <div className={`${currentSize.container} flex flex-col items-center justify-center space-y-4`}>
        <Spinner />
        <p className={`${currentColor.text} font-medium ${currentSize.text}`}>{message}</p>
      </div>
    );
  }

  // Variant: Inline Loading (horizontal layout, for buttons/inline elements)
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          <div className={`${currentSize.spinner} border-2 ${currentColor.primary} rounded-full border-t-transparent animate-spin`}></div>
        </div>
        <span className={`${currentColor.text} font-medium ${currentSize.text}`}>{message}</span>
      </div>
    );
  }

  // Variant: Overlay Loading (for overlaying existing content)
  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
        <div className={`bg-white rounded-2xl shadow-xl ${currentSize.container} flex flex-col items-center space-y-4 border-2 border-slate-200`}>
          <Spinner />
          <p className={`${currentColor.text} font-medium ${currentSize.text}`}>{message}</p>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="flex items-center justify-center p-6">
      <Spinner />
    </div>
  );
};

LoadingSpinner.propTypes = {
  variant: PropTypes.oneOf(["fullscreen", "card", "inline", "overlay"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  message: PropTypes.string,
  color: PropTypes.oneOf(["indigo", "emerald", "slate", "rose", "amber"])
};

export default LoadingSpinner;
