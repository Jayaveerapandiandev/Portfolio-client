// src/api/userApi.js
import apiClient from "./apiClient";

// 🔹 LOGIN
export const loginUser = async (data) => {
  const response = await apiClient.post("/User/login", data);
  return response.data;
};

// 🔹 LOGOUT
export const logoutUser = async (sessionId) => {
  const response = await apiClient.post("/User/logout", { sessionId });
  return response.data;
};

// 🔹 CREATE NEW USER
export const registerUser = async (data) => {
  const response = await apiClient.post("/User/register", data);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.post("/User/Delete", { userId });
  return response.data;
};

export const updateHomeData = async (data) => {
  const response = await apiClient.post("/Admin/Save", data);
  return response.data;
};

export const getHomeData = async () => {
  const response = await apiClient.get("/Admin/Get");
  return response.data;
};

export const getAbout = async () => {
  const res = await apiClient.get("/About/get");
  return res.data;
};

export const updateAbout = async (data) => {
  const res = await apiClient.post("/About/Save", data);
  return res.data;
};


