import apiClient from "../auth";

// GET /api/payment-providers/
export async function fetchPaymentProviders() {
    const res = await apiClient.get("payment-providers/")
    return res.data; // array
}

// GET /api/payment-providers/{id}/
export async function fetchPaymentProvider(id) {
    const res = await apiClient.get(`payment-providers/${id}`)
    return res.data;
}

// POST /api/payment-providers/
export async function createPaymentProvider(payload) {
    const res = await apiClient.post("payment-providers/", payload )
    return res.data;
}

// PATCH /api/payment-providers/{id}/
export async function updatePaymentProvider(id, payload) {
    const res = await apiClient.patch(`payment-providers/${id}/`, payload)
    return res.data;
}

// DELETE /api/payment-providers/{id}/ (optional)
export async function deletePaymentProvider(id) {
    const res = await apiClient.delete(`payment-providers/${id}/`)
    return res.data;
}
