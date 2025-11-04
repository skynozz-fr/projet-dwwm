import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Ajoute le token si présent
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
