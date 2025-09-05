import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // your backend URL from .env
  withCredentials: true, // important: send cookies with requests
});

// USER APIs
export const callRegisterUserApi = async (formData) => {
  const response = await API.post("/api/user/register", formData);
  return response.data;
};

export const callLoginUserApi = async (formData) => {
  const response = await API.post("/api/user/login", formData);
  return response.data;
};

export const callUserAuthApi = async () => {
  const response = await API.get("/api/user/auth"); // use GET for auth check
  return response.data;
};

export const callLogoutApi = async () => {
  const response = await API.post("/api/user/logout");
  return response.data;
};

// TASK APIs
export const addNewTaskApi = async (formData) => {
  const response = await API.post("/api/task/add-new-task", formData);
  return response.data;
};

export const getAllTasksApi = async (userId) => {
  const response = await API.get(`/api/task/get-all-tasks-by-userid/${userId}`);
  return response.data;
};

export const updateTaskApi = async (formData) => {
  const response = await API.put("/api/task/update-task", formData);
  return response.data;
};

export const deleteTaskApi = async (taskId) => {
  const response = await API.delete(`/api/task/delete-task/${taskId}`);
  return response.data;
};

export default API;
