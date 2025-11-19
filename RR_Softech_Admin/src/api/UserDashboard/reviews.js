import apiClient from "../auth";

export async function fetchReviews() {
  const res = await apiClient.get("reviews/");
  return res.data;
}
export async function deleteReview(id) {
  const res = await apiClient.delete(`reviews/${id}/`);
  return res.data;
}