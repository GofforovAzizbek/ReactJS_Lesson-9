export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://e-commerce-api-v2.nt.azimumarov.uz/api/v1";

export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);
