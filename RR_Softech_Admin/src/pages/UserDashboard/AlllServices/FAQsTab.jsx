import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQsTab({ plans }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  // Collect all FAQs from all plans
  const allFAQs = plans.flatMap((plan) =>
    (plan.faqs || []).map((faq) => ({
      ...faq,
      planName: plan.name,
    }))
  );

  if (allFAQs.length === 0) {
    return (
      <div className="text-center py-16">
        <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No FAQs available</p>
        <p className="text-gray-400 text-sm mt-2">
          Check back later for frequently asked questions
        </p>
      </div>
    );
  }

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600 mt-1">
          Find answers to common questions about our plans
        </p>
      </div>

      <div className="space-y-3">
        {allFAQs.map((faq) => {
          const isOpen = openFAQ === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-gray-500">{faq.planName} Plan</p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {isOpen && (
                <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
