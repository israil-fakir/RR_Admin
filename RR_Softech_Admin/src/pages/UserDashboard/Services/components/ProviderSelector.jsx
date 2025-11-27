import React, { useMemo } from "react";

export default function ProviderSelector({
  providers = [],
  loading = false,
  selectedProvider,
  onSelect,
  toggle,
  onToggle,
}) {
  // Normalize type matching
  const bankProviders = useMemo(() => {
    return providers.filter(
      (p) => (p.type || "").toUpperCase() === "BANK_TRANSFER"
    );
  }, [providers]);

  const otherProviders = useMemo(() => {
    return providers.filter(
      (p) => (p.type || "").toUpperCase() !== "BANK_TRANSFER"
    );
  }, [providers]);

  const listToRender = toggle === "bank" ? bankProviders : otherProviders;

  return (
    <div className="w-full bg-white p-3 rounded-lg border border-gray-200">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggle("riskpay")}
            className={`px-3 py-1 rounded-md text-sm ${
              toggle === "riskpay"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Riskpay
          </button>
          <button
            type="button"
            onClick={() => onToggle("bank")}
            className={`px-3 py-1 rounded-md text-sm ${
              toggle === "bank"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Bank
          </button>
        </div>

        <div className="text-sm text-gray-500">
          {loading ? "Loading providers..." : `${listToRender.length} providers`}
        </div>
      </div>

      {/* Provider List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {listToRender.map((p) => {
          const active =
            selectedProvider?.provider_name_code === p.provider_name_code; // FIXED

          return (
            <button
              key={p.provider_name_code} // FIXED
              onClick={() => onSelect(p)} // FIXED: Send full provider object
              className={`flex items-center gap-3 w-full text-left p-3 rounded-lg border transition ${
                active
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-100 hover:bg-gray-50"
              }`}
            >
              <img
                src={p.logo}
                alt={p.title}
                className="h-8 w-8 object-contain"
              />

              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {p.title}
                </div>
                <div className="text-xs text-gray-500">
                  Min: {p.min_amount} — Max: {p.max_amount}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {(p.type || "").toUpperCase()}
              </div>
            </button>
          );
        })}

        {listToRender.length === 0 && !loading && (
          <div className="col-span-full text-sm text-gray-500">
            No providers available in this category.
          </div>
        )}
      </div>
    </div>
  );
}
