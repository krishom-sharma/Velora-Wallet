import axios from "axios";
import { useAppStore } from "../store/uiStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().csrfToken;
  if (token && !config.headers["X-CSRF-Token"]) {
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().setUser(null);
    }
    throw error;
  }
);

export const bootstrapCsrf = async () => {
  const { data } = await api.get("/auth/csrf-token");
  useAppStore.getState().setCsrfToken(data.csrfToken);
  return data.csrfToken;
};
