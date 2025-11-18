import apiClient from './../auth';

export async function fetchServices() {
  const res = await apiClient.get("services/");
  return res.data;
}