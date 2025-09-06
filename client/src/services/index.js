// src/services/index.js
import axios from "axios";

// ✅ Create axios instance with baseURL = "/api"
// When deployed, frontend and backend will share the same domain,
// so "/api" automatically points to your backend routes.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // allows cookies (important for auth sessions)
});

// =======================
// 🔹 User Authentication
// =======================

// Register user
export const registerUser = (userData) => api.post("/users/register", userData);

// Login user
export const loginUser = (userData) => api.post("/users/login", userData);

// Check if authenticated
export const checkAuth = () => api.get("/users/auth");

// Logout user
export const logoutUser = () => api.post("/users/logout");

// =======================
// 🔹 Task Management
// =======================

// Get all tasks
export const getTasks = () => api.get("/tasks");

// Create new task
export const createTask = (taskData) => api.post("/tasks", taskData);

// Update a task
export const updateTask = (taskId, updatedData) =>
  api.put(`/tasks/${taskId}`, updatedData);

// Delete a task
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);
