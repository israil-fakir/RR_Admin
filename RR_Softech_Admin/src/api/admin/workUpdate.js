import apiClient from "../auth";


export async function postWorkUpdate(payload) {
  const res = await apiClient.post("work-updates/",payload);
  return res.data;
}