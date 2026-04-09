import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./env";

function getAuthToken() {
  return (
    import.meta.env.VITE_API_TOKEN ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("apiToken") ||
    ""
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: API_TIMEOUT,
});

api.interceptors.request.use(
  (config) => {
    const method = String(config.method || "get").toUpperCase();
    const url = `${config.baseURL || ""}${config.url || ""}`;
    const label =
      method === "GET" && config.url?.includes("/products")
        ? "Fetching products..."
        : `${method} request started`;

    console.info(label, { method, url, params: config.params || null });

    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    const method = String(response.config?.method || "get").toUpperCase();
    const url = `${response.config?.baseURL || ""}${response.config?.url || ""}`;
    const label =
      method === "GET" && response.config?.url?.includes("/products")
        ? "Products loaded"
        : `${method} request succeeded`;

    console.info(label, {
      method,
      url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    const method = String(error.config?.method || "get").toUpperCase();
    const url = `${error.config?.baseURL || ""}${error.config?.url || ""}`;
    const label =
      method === "GET" && error.config?.url?.includes("/products")
        ? "Error fetching products"
        : `${method} request failed`;

    console.error(label, {
      method,
      url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    console.error("API error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);
