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

// 🔹 CHANGE PASSWORD
export const changePassword = async (data) => {
  const response = await apiClient.put("/User/change-password", data);
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

export const deleteExperiencePosition = async (experienceId) => {
  const response = await apiClient.delete(`/Experience/deletePosition/${experienceId}`);
  return response.data;
};

//Skills Api calls 
export const getSkills = async () => {
  const response = await apiClient.get("/Skills/GetSkills");
  return response.data;
};

export const addSkill = async (data) => {
  const response = await apiClient.post("/Skills/AddNewSkill", data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await apiClient.put(`/Skills/UpdateSkills/${id}`, data);
  return response.data;
};

export const deleteSkillById = async (id) => {
  const response = await apiClient.delete(`/Skills/deleteSkill/${id}`);
  return response.data;
};

// Connect API calls
export const sendMessage = async (data) => {
  const res = await apiClient.post("/Messages/create", data);
  return res.data;
};

export const getAllMessages = async () => {
  const response = await apiClient.get("/Messages/all");
  return response.data;
};

export const markMessageAsSeen = async (id) => {
  const response = await apiClient.patch(`/Messages/mark-seen/${id}`);
  return response.data;
};

export const deleteMessageById = async (id) => {
  const response = await apiClient.delete(`/Messages/delete/${id}`);
  return response.data;
};


// ===================== EDUCATION API =====================

// Get all education records
export const getEducation = async () => {
  const response = await apiClient.get("/Education/GetEducation");
  return response.data;
};

// Add new education
export const addEducation = async (data) => {
  const response = await apiClient.post("/Education/add", data);
  return response.data;
};

// Update education by id
export const updateEducation = async (id, data) => {
  const response = await apiClient.put(
    `/Education/UpdateEducation/${id}`,
    data
  );
  return response.data;
};

// Delete education by id
export const deleteEducationById = async (id) => {
  const response = await apiClient.delete(
    `/Education/DeleteEducation/${id}`
  );
  return response.data;
};
