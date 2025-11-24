import apiClient from "../auth";

export async function postAvailabilities(payload) {
  const res = await apiClient.post("availabilities/",payload);
  return res.data;
}
export async function showAvailabilities() {
  const res = await apiClient.get("availabilities/");
  return res.data;
}
export async function showAvailabilitiesID(id) {
  const res = await apiClient.get(`availabilities/${id}`);
  return res.data;
}

export async function editMeetingLink(id,payload) {
  const res = await apiClient.post(`appointments/${id}/confirm_and_send_link/`,payload);
  return res.data;
}
export async function updateAppointmentStatus(id) {
  const res = await apiClient.patch(`appointments/${id}/update_status/`);
  return res.data;
}
export async function deleteAvailabilities(id) {
  const res = await apiClient.delete(`availabilities/${id}/`);
  return res.data;
}