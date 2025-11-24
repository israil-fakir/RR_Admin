import apiClient from "../auth";


export async function showDashboardAnalytics() {
  const res = await apiClient.get("dashboard/admin/");
  return res.data;
}