import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { fetchReviews } from "../../../../api/UserDashboard/reviews";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export default function ReviewList({ productPlan }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchReviews();
      // Filter reviews by order (productId)
      const filtered = data.filter((r) => r.plan === productPlan);
      setReviews(filtered);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productPlan]);

  return (
    <div className="bg-white p-6 rounded-xl flex flex-col space-y-5">
      {loading && <LoadingSpinner  message = "Loading All Reviews..." size="sm" variant="inline"/>}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-800 text-sm">
                {`${review.user?.first_name + " " + review.user?.last_name}` ||
                  `${review.user?.email}` ||
                  "Unknown User"}
              </p>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      review.rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
