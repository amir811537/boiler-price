// src/api/api.js
import axios from "axios";

const api = axios.create({
  // baseURL: "https://price-app-backend.vercel.app",
  baseURL: "http://localhost:5000",
});

export default api;
