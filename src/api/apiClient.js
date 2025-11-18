// src/api/apiClient.js
import axios from "axios";

// 🔹 Base API instance
const apiClient = axios.create({
  baseURL: "https://localhost:7092/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Attach sessionId as a custom header
apiClient.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      config.headers["X-Session-Id"] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
