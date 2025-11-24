import React, { useState } from "react";

export default function ProviderSelector({
  providers,
  selectedProvider,
  handleProviderSelect,
  onToggle
}) {
  const [activeTab, setActiveTab] = useState("riskpay");

  const filteredProviders = providers.filter((p) =>
    activeTab === "bank"
      ? p.provider_name_code === "bank"
      : p.provider_name_code !== "bank"
  );

  const handleToggle = (value) => {
    setActiveTab(value);
    onToggle(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full bg-gray-100 p-2 rounded-xl">
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => handleToggle("riskpay")}
            className={`
        w-1/2 py-3 text-sm font-semibold rounded-lg border 
        transition-all duration-300 ease-in-out
        ${
          activeTab === "riskpay"
            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
        }
      `}
          >
            RiskPay Payment
          </button>
          <button
            type="button"
            onClick={() => handleToggle("bank")}
            className={`
        w-1/2 py-3 text-sm font-semibold rounded-lg border 
        transition-all duration-300 ease-in-out
        ${
          activeTab === "bank"
            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
        }
      `}
          >
            Bank Payment
          </button>
        </div>
      </div>

      {/* ------------------ Providers List ------------------ */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-600 font-medium text-center">
          Select Payment Provider
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProviders.length === 0 && (
            <p className="text-gray-500 text-sm">No providers available.</p>
          )}

          {filteredProviders.map((p) => {
            const active = selectedProvider?.id === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderSelect(p)}
                className={`flex items-center gap-3 p-3 border rounded-lg w-full text-left 
                  transition-all duration-200
                  ${
                    active
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <img
                  src={p.logo}
                  alt={p.title}
                  className="w-10 h-10 object-contain"
                />

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    Min ${p.min_amount} — Max ${p.max_amount}
                  </p>
                </div>

                {active && (
                  <div className="text-xs text-blue-600 font-medium">
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
