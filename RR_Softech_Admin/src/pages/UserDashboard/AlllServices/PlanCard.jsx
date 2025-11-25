import React, { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { postOrders } from "../../../api/UserDashboard/orders";
import { toast } from "react-toastify";

export default function PlanCard({ plan }) {
  const isPopular = plan.name?.toLowerCase() === "pro";
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e, planId) => {
    e.preventDefault();

    try {
      setLoading(true);
      alert("Are you sure you want to place this order?");

      await postOrders({ plan: planId });
      toast.success("Order placed successfully.");
    } catch (error) {
      toast.error("Something went wrong while placing the order.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1) Old plans: features come from API array
  const hasFeatureArray =
    Array.isArray(plan.features) && plan.features.length > 0;

  // 2) New plans: features are written in description (one per line)
  const descriptionLines = (plan.description || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // if first line is just "Demo" or similar, treat it as tagline
  const firstLineIsDemo =
    descriptionLines[0] &&
    /^demo$/i.test(descriptionLines[0].replace(/\./g, ""));

  const tagline = firstLineIsDemo ? descriptionLines[0] : null;
  const bulletLines = hasFeatureArray
    ? [] // we’ll use plan.features instead
    : firstLineIsDemo
      ? descriptionLines.slice(1)
      : descriptionLines;

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col relative ${isPopular
        ? "border-blue-500 shadow-lg"
        : "border-gray-200 shadow-md hover:border-blue-300"
        }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          ⭐ Most Popular
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {plan.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-extrabold text-gray-900">
              ${parseFloat(plan.price).toFixed(0)}
            </span>
            <div className="text-left">
              <span className="text-gray-500 text-sm font-medium block">
                per month
              </span>
              <span className="text-gray-400 text-xs">
                {plan.billing_cycle?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Tagline (e.g. Demo) */}
        {tagline && (
          <p className="text-gray-600 text-center text-sm mb-4">{tagline}</p>
        )}

        {/* Features List (array first, then description fallback) */}
        <div className="flex-1">
          <div className="space-y-3 mb-8">
            {hasFeatureArray
              ? plan.features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {feature.description}
                  </span>
                </div>
              ))
              : bulletLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {line}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Order Button */}
        <button
          className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl ${isPopular
            ? "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          disabled={loading}
          onClick={(e) => handleOrder(e, plan.id)}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{loading ? "Processing..." : "Place Order"}</span>
        </button>
      </div>

      {/* Bottom Accent */}
      <div
        className={`h-1.5 rounded-b-2xl ${isPopular
          ? "bg-linear-to-r from-blue-500 to-purple-500"
          : "bg-gray-200"
          }`}
      />
    </div>
  );
}
