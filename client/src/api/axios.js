import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
if (!apiUrl) console.error("API URL missing");

const api = axios.create({
  baseURL: apiUrl,
});

export default api;
