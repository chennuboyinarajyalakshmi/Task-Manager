import axios from "axios";  // ✅ Add this line

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

export default api;
