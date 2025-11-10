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


export const addExperience = async (data) => {
  const response = await apiClient.post("/Experience/add", data);
  return response.data;
};

// 🔹 2️⃣ Get all companies with experiences
export const getCompanies = async () => {
  const response = await apiClient.get("/Experience/all");
  return response.data;
};

// 🔹 3️⃣ Add a new position (experience) for an existing company
export const addExperienceForExistingCompany = async (data) => {
  const response = await apiClient.post("/Experience/addForExistingCompany", data);
  return response.data;
};

// 🔹 4️⃣ Delete a company and all its experiences
export const deleteExperienceCompany = async (companyId) => {
  const response = await apiClient.delete(`/Experience/delete/${companyId}`);
  return response.data;
};

