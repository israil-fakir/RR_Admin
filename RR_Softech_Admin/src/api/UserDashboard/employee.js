import apiClient from "../auth";

export async function fetchEmployees() {
  const res = await apiClient.get("public-employees/");
  return res.data;
}