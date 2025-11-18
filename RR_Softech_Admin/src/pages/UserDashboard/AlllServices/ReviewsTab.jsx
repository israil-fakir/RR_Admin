import React from "react";
import { Star, User } from "lucide-react";

export default function ReviewsTab({ plans }) {
  // Collect all reviews from all plans
  const allReviews = plans
    .flatMap((plan) =>
      (plan.reviews || []).map((review) => ({
        ...review,
        planName: plan.name,
      }))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (allReviews.length === 0) {
    return (
      <div className="text-center py-16">
        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No reviews yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Be the first to review this service
        </p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
        <p className="text-gray-600 mt-1">
          {allReviews.length} {allReviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="space-y-4">
        {allReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.user.first_name} {review.user.last_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {review.planName} Plan
                  </p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 leading-relaxed mb-3">
              {review.comment}
            </p>

            {/* Review Date */}
            <p className="text-xs text-gray-400">
              {new Date(review.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
