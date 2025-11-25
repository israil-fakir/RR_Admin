import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";

export default function CustomAmountInput({
  initResponse,
  selectedProvider,
  isCustom,
  setIsCustom,
  displayAmount,
  handleAmountChange,
  error,
  onDisableCustom,
  onClick,
  disabled,
  loading
}) {


  if (initResponse?.payment_type !== "GATEWAY") return null;

  const baseAmount = Number(displayAmount || initResponse?.milestone_amount || 0);

  // SAFE: Hook at top level
  const { localFee, localTotal } = useMemo(() => {
    const percent = Number(selectedProvider?.processing_fee_percentage || 0);

    if (!isCustom) {
      return {
        localFee: Number(initResponse?.processing_fee || 0),
        localTotal: Number(initResponse?.final_charge_amount || 0),
      };
    }

    const fee = (baseAmount * percent) / 100;
    const total = baseAmount + fee;

    return {
      localFee: Number(fee.toFixed(2)),
      localTotal: Number(total.toFixed(2)),
    };
  }, [
    baseAmount,
    isCustom,
    selectedProvider?.processing_fee_percentage,
    initResponse?.processing_fee,
    initResponse?.final_charge_amount,
  ]);

  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-gray-200">

      {/* Header + Toggle */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-600 font-medium">Amount</label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsCustom(checked);

              if (!checked && onDisableCustom) {
                onDisableCustom(); // resets to API values
              }
            }}
            className="h-4 w-4"
          />
          <span className="text-gray-700">Pay custom amount</span>
        </label>
      </div>

      {/* Custom Amount Input */}
      <input
        type="number"
        value={displayAmount}
        onChange={handleAmountChange}
        placeholder={
          selectedProvider
            ? `Min ${selectedProvider.min_amount} - Max ${selectedProvider.max_amount}`
            : "Select a provider first"
        }
        className={`border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
          !isCustom ? "bg-gray-100 text-gray-700" : "bg-white"
        }`}
        disabled={!selectedProvider || !isCustom}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Breakdown Box */}
      <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Payment Breakdown
        </h3>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Main Amount</span>
          <span className="font-medium text-gray-900">${baseAmount}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Processing Fee</span>
          <span className="font-medium text-gray-900">${localFee}</span>
        </div>

        <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total Payable</span>
          <span>${localTotal}</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || loading}
          className={`w-full text-center py-3 rounded-lg text-white font-medium transition
          ${
            disabled || loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <span>Pay Now</span>
          )}
        </button>
      </div>
    </div>
  );
}
