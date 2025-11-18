import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { postFeedback } from "../../../../api/UserDashboard/feedback";
import ReviewList from "./ReviewList";

const FeedbackSection = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1) {
      toast.error("Please provide a rating before submitting.");
      return;
    }

    const payload = {
      order: productId,
      rating,
      comment: feedback.trim(),
    };

    try {
      await postFeedback(payload);

      toast.success("Feedback submitted successfully!");
      setRating(0);
      setFeedback("");
    } catch (error) {
      const res = error?.response;
      const data = res?.data;

      // Handle order already reviewed
      if (Array.isArray(data?.order) && data.order[0]?.includes("exists")) {
        toast.error("You have already submitted a review for this order.");
        return;
      }

      // Known status codes
      switch (res?.status) {
        case 400:
          toast.error("Invalid request. Please check your input.");
          return;

        case 401:
          toast.error("You must be logged in to submit a review.");
          return;

        case 403:
          toast.error("You are not allowed to submit feedback for this order.");
          return;

        case 404:
          toast.error("Order not found.");
          return;

        case 500:
          toast.error("Server error. Please try again later.");
          return;

        default:
          break;
      }

      // Fallback error message
      toast.error(
        data?.message || "Failed to submit feedback. Please try again."
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-white p-6 flex flex-col space-y-5"
      >
        {/* Rating */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Rate Your Experience
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`w-7 h-7 ${
                    (hover || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Your Feedback
          </label>
          <textarea
            className="w-full min-h-[120px] border border-gray-300 rounded-xl p-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="Share your experiences with this service..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
        >
          Submit Feedback
        </button>
      </form>
      {/* <ReviewList /> */}
    </div>
  );
};

export default FeedbackSection;
