import apiClient from "../auth";

// POST /api/services/
export async function createService(payload) {
  const res = await apiClient.post("services/", payload);
  return res.data;
}

// GET /api/services/
export async function fetchServices() {
  const res = await apiClient.get("services/");
  return res.data;
}

