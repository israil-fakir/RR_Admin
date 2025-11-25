import axios from "axios";

// https://backend-final.rrsoftech.co.uk/api/
//https://global.genzsoft.top/api/


const BASE_URL = "https://backend-final.rrsoftech.co.uk/api/";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const isFormData = config.data instanceof FormData;

  if (isFormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});


// ----------- AUTH API FUNCTIONS -----------

export async function registerUser(payload) {
  const res = await apiClient.post("/users/register/", payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await apiClient.post("token/", payload);
  return res.data;
}

export async function refreshTokenApi(refresh) {
  const res = await apiClient.post("token/refresh/", { refresh });
  return res.data;
}

export async function changePasswordApi(accessToken, body) {
  const res = await apiClient.patch("change-password/", body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

export async function forgotPassword(payload) {
  const res = await apiClient.post("request-reset-password/", payload);
  return res.data;
}

export default apiClient;
