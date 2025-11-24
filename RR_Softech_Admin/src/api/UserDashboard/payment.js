import apiClient from "../auth";

export async function fetchPaymentProvider() {
  const res = await apiClient.get("payment-providers/");
  return res.data;
}
export async function postIntiPayment(payload,id) {
  const res = await apiClient.post(`milestones/${id}/initiate_payment/`,payload);
  return res.data;
}
export async function postSubmitProof(payload,id) {
  const res = await apiClient.post(`transactions/${id}/submit_proof/`,payload);
  return res.data;
}
export async function fetchPaymentStatus(payload,id) {
  const res = await apiClient.post(`transactions/${id}/submit_proof/`,payload);
  return res.data;
}
export async function VerifyingPaymentStatus() {
  const res = await apiClient.get(`transactions/`);
  return res.data;
}
export async function updatePaymentStatus(id,payload) {
  const res = await apiClient.post(`transactions/${id}/approve_transfer/`,payload);
  return res.data;
}

