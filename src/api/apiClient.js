// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7092/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Attach JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle 401 Unauthorized (token expired/invalid)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = "login";
    }
    
    if (error.response && error.response.data) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default apiClient;