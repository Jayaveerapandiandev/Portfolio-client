// src/api/apiClient.js
import axios from "axios";

// 🔹 Base API instance
const apiClient = axios.create({
  baseURL: "https://localhost:7092/api", // change this to your backend root URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Optionally attach token if stored in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      // Just send sessionId as a custom header (no Bearer)
      config.headers["X-Session-Id"] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
