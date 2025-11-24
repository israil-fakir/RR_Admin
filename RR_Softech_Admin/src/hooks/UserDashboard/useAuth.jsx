
import { useCallback, useEffect, useState } from "react";
import apiClient, { refreshTokenApi } from "../../api/auth";


const REFRESH_KEY = "auth_refresh";
const ACCESS_KEY = "auth_access";
const USER_KEY = "auth_user";
const Role = "role" ;
const user_ID = "user_id" ;
let isRefreshing = false;
let refreshPromise = null;

export function saveTokens({ access, refresh, user = null ,role,userID}) {
  
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (role) localStorage.setItem(Role, JSON.stringify(role));
  if (userID) localStorage.setItem(user_ID, JSON.stringify(userID));
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(Role);
  localStorage.removeItem(user_ID);
}
export function getStoredTokens() {
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
    user: JSON.parse(localStorage.getItem(USER_KEY) || "null"),
    role:JSON.parse(localStorage.getItem(Role)),
    userID:JSON.parse(localStorage.getItem(user_ID)),
  };
}

export default function useAuth() {
  const [auth, setAuth] = useState(getStoredTokens());
  

  const setAuthState = useCallback((tokens) => {
    saveTokens(tokens);
    setAuth(getStoredTokens());
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setAuth(getStoredTokens());
  }, []);

  // attach axios interceptor once
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {

      
      const token = localStorage.getItem(ACCESS_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = apiClient.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // If unauthorized and we have refresh token, try refresh once
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          const refresh = localStorage.getItem(REFRESH_KEY);
          if (!refresh) {
            // no refresh token -> logout client
            clearTokens();
            setAuth(getStoredTokens());
            return Promise.reject(error);
          }

          // prevent multiple refresh calls
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshTokenApi(refresh)
              .then((data) => {
                if (data && data.access) {
                  localStorage.setItem(ACCESS_KEY, data.access);
                }
                return data;
              })
              .catch((err) => {
                clearTokens();
                throw err;
              })
              .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
          }

          try {
            await refreshPromise;
            originalRequest._retry = true;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_KEY)}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            clearTokens();
            setAuth(getStoredTokens());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return {
    auth,
    setAuthState,
    logout,
    saveTokens,
  };
}
