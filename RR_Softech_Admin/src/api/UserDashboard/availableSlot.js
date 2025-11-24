import apiClient from "../auth";

export async function fetchAvailableSlots(date, employee_id) {
  const res = await apiClient.get("available-slots/", {
    params: { date, employee_id }
  });
  return res.data;
}
