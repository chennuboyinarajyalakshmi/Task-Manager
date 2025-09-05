import axios from "axios";

// ✅ Create axios instance with base URL from .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // example: https://task-manager-server-cll8.onrender.com
  withCredentials: true, // send cookies if backend uses sessions
});

// ===================== USER APIs =====================

// Register
export const callRegisterUserApi = async (formData) => {
  const response = await API.post("/api/user/register", formData);
  return response.data;
};

// Login
export const callLoginUserApi = async (formData) => {
  const response = await API.post("/api/user/login", formData);
  return response.data;
};

// Auth check
export const callUserAuthApi = async () => {
  const response = await API.post("/api/user/auth", {});
  return response.data;
};

// Logout
export const callLogoutApi = async () => {
  const response = await API.post("/api/user/logout", {});
  return response.data;
};

// ===================== TASK APIs =====================

// Add new task
export const addNewTaskApi = async (formData) => {
  const response = await API.post("/api/task/add-new-task", formData);
  return response.data;
};

// Get all tasks by user id
export const getAllTasksApi = async (userId) => {
  const response = await API.get(`/api/task/get-all-tasks-by-userid/${userId}`);
  return response.data;
};

// Update task
export const updateTaskApi = async (formData) => {
  const response = await API.put("/api/task/update-task", formData);
  return response.data;
};

// Delete task
export const deleteTaskApi = async (taskId) => {
  const response = await API.delete(`/api/task/delete-task/${taskId}`);
  return response.data;
};
