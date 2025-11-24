import apiClient from "../auth";

export async function showAppointments() {
  const res = await apiClient.get("appointments/");
  return res.data;
}
export async function postAppointments(payload) {
  const res = await apiClient.post("appointments/",payload);
  return res.data;
}