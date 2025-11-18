import React from "react";
import PlanCard from "./PlanCard";

export default function ServiceSection({ service }) {
  return (
    <section className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-gray-900">
          {service.name}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mt-3">
          {service.description}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {service.plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
