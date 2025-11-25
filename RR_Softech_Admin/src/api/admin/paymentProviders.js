import apiClient from "../auth";


export async function fetchPaymentProviders() {
    const res = await apiClient.get("payment-providers/")
    return res.data;
}


export async function fetchPaymentProvider(id) {
    const res = await apiClient.get(`payment-providers/${id}`)
    return res.data;
}


export async function createPaymentProvider(payload) {
    const res = await apiClient.post("payment-providers/", payload )
    return res.data;
}


export async function updatePaymentProvider(id, payload) {
    const res = await apiClient.patch(`payment-providers/${id}/`, payload)
    return res.data;
}


export async function deletePaymentProvider(id) {
    const res = await apiClient.delete(`payment-providers/${id}/`)
    return res.data;
}
