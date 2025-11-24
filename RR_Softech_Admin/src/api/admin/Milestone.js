import apiClient from "../auth";


export async function postMilestone(payload) {
  const res = await apiClient.post("milestones/",payload);
  return res.data;
}
export async function deleteMilestone(id) {
  const res = await apiClient.delete(`milestones/${id}/`);
  return res.data;
}