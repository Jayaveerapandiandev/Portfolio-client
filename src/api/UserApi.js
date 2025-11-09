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


// 🔹 PROJECTS API
export const getProjects = async () => {
  const res = await apiClient.get("/Project/all");
  return res.data;
};

export const addProject = async (data) => {
  const res = await apiClient.post("/Project/add", data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await apiClient.put(`/Project/update/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await apiClient.delete(`/Project/delete/${id}`);
  return res.data;
};

// ✅ Get all experience
export const getExperience = async () => {
  const res = await apiClient.get("/Experience/all");
  return res.data;
};

// ✅ Add new company + first role
export const addExperience = async (data) => {
  const res = await apiClient.post("/Experience/add", data);
  return res.data;
};

// ✅ Update company
export const updateExperience = async (id, data) => {
  const res = await apiClient.put(`/Experience/update/${id}`, data);
  return res.data;
};

// ✅ Delete company
export const deleteExperience = async (id) => {
  const res = await apiClient.delete(`/Experience/delete/${id}`);
  return res.data;
};

// ✅ Add a new role to company
export const addPosition = async (experienceId, data) => {
  const res = await apiClient.post(`/Experience/position/add/${experienceId}`, data);
  return res.data;
};

// ✅ Update a role
export const updatePosition = async (positionId, data) => {
  const res = await apiClient.put(`/Experience/position/update/${positionId}`, data);
  return res.data;
};

// ✅ Delete a role
export const deletePosition = async (positionId) => {
  const res = await apiClient.delete(`/Experience/position/delete/${positionId}`);
  return res.data;
};



