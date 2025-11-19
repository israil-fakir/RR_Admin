import React, { useEffect, useState } from "react";
import { Search, Reply, Archive, Star } from "lucide-react";
import SearchBar from "../../../components/shared/admin/SearchBar";
import { deleteReview, fetchReviews } from "../../../api/UserDashboard/reviews";
import Pagination from "../../../components/shared/userDashboard/Pagination";
import { toast } from "react-toastify";

// ----------------------
// Helper Functions
// ----------------------
function getUserName(user) {
  if (!user) return "Unknown User";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.email || "Unknown User";
}

function getService(service) {
  return service?.name || "Unknown Service";
}

function getImage(user) {
  return user?.image || "https://i.pravatar.cc/100?img=12";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
}

// ----------------------
// MAIN COMPONENT
// ----------------------
export default function Feedback() {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchReviews();
        setReviews(response?.results || response || []);
      } catch (err) {
        setError("Failed to load reviews. Please try again.");
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = reviews.filter((item) => {
    const name = getUserName(item?.user).toLowerCase();
    const service = getService(item?.service).toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      service.includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReviews = filteredData.slice(startIndex, startIndex + pageSize);
  

  const handleArchive = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((item) => item.id !== id));
      toast.success("Review Delete Sucessfull")
    } catch {
      alert("Failed to archive review.");
    }
  };

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Feedback</h2>
        <p className="text-gray-500 text-sm">
          Review and respond to client feedback and ratings.
        </p>
      </div>

      <SearchBar
        type="text"
        placeholder="name or service"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5"
      />

      {/* Loading & Error States */}
      {loading && (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-center py-6 text-red-500">{error}</p>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          <div className="space-y-4">
            {paginatedReviews.length ? (
              paginatedReviews.map((item) => (        
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src={getImage(item.user)}
                        alt={getUserName(item.user)}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {getUserName(item.user)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getService(item.service)}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mt-1">
                          {Array.from({
                            length: Math.max(0, Math.min(5, item.rating)),
                          }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-gray-500 mt-2 sm:mt-0">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 text-sm mt-3">{item.comment}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                      <Reply size={15} /> Reply
                    </button>
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Archive size={15} /> Archive
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">
                No feedback found
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}
