// src/services/index.js
import axios from "axios";

// 👉 Use environment variable, fallback to localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ========== AUTH ==========
export const callRegisterUserApi = async (formData) => {
  const response = await API.post("/user/register", formData);
  return response?.data;
};

export const callLoginUserApi = async (formData) => {
  const response = await API.post("/user/login", formData);
  return response?.data;
};

export const callUserAuthApi = async () => {
  const response = await API.get("/user/auth"); // GET better for auth check
  return response?.data;
};

export const callLogoutApi = async () => {
  const response = await API.post("/user/logout");
  return response?.data;
};

// ========== TASKS ==========
export const addNewTaskApi = async (formData) => {
  const response = await API.post("/task/add-new-task", formData);
  return response?.data;
};

export const getAllTasksApi = async (getCurrentUserId) => {
  const response = await API.get(`/task/get-all-tasks-by-userid/${getCurrentUserId}`);
  return response?.data;
};

export const updateTaskApi = async (formData) => {
  const response = await API.put("/task/update-task", formData);
  return response?.data;
};

export const deleteTaskApi = async (getCurrentTaskId) => {
  const response = await API.delete(`/task/delete-task/${getCurrentTaskId}`);
  return response?.data;
};
