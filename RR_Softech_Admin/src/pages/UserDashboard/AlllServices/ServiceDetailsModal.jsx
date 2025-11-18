import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Star, HelpCircle } from "lucide-react";
import FAQsTab from "./FAQsTab";
import ReviewsTab from "./ReviewsTab";
import PlansTab from "./PlansTab";

const tabs = [
  { value: "plans", label: "Plans", icon: Package },
  { value: "reviews", label: "Reviews", icon: Star },
  { value: "faqs", label: "FAQs", icon: HelpCircle },
];

export default function ServiceDetailsModal({ isOpen, service, onClose }) {
  const [activeTab, setActiveTab] = useState("plans");
motion
  // Reset to plans tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("plans");
    }
  }, [isOpen]);

  if (!service) return null;

  const getButtonClass = (tabValue) => {
    const isActive = activeTab === tabValue;
    return `flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
      isActive
        ? "bg-white text-blue-600 shadow-md"
        : "text-gray-600 hover:text-gray-900 hover:bg-blue-50"
    }`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-3/4 lg:w-2/3 bg-gradient-to-br from-gray-50 to-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex bg-blue-100 rounded-xl p-1.5 mt-6 space-x-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.value}
                        className={getButtonClass(tab.value)}
                        onClick={() => setActiveTab(tab.value)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeTab === "plans" && <PlansTab plans={service.plans} />}
                  {activeTab === "reviews" && (
                    <ReviewsTab plans={service.plans} />
                  )}
                  {activeTab === "faqs" && <FAQsTab plans={service.plans} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
