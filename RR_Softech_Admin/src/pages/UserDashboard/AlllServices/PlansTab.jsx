import React from "react";
import PlanCard from "./PlanCard";

export default function PlansTab({ plans }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No plans available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Choose Your Perfect Plan
        </h3>
        <p className="text-gray-600 mt-1">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
