import apiClient from "../auth";

export async function fetchUserDetails(id) {
  const res = await apiClient.get(`users/management/${id}/`);
  return res.data;
}