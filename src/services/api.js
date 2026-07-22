import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:9077/api"
});
 
// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
 
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Auto logout on invalid/expired session; surface rate limits
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
 
      toast.error(
        "Your session has expired or you have logged in from another device."
      );
 
      window.location.href = "/login";
    }

    if (error.response?.status === 429 && !error.config?.skipErrorToast) {
      toast.error(
        error.response?.data?.message ||
          "Too many requests. Please try again later."
      );
    }
 
    return Promise.reject(error);
  }
);
 
export default api;