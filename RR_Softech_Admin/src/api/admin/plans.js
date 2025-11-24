import apiClient from "../auth";

// POST /api/plans/
export async function createPlan(payload) {
    const res = await apiClient.post("plans/", payload);
    return res.data;
}